import "./About.css"
import { ReactComponent as PaperIcon } from "./paper_icon.svg"
import { ReactComponent as CodeIcon } from "./code_icon.svg"
import { useRef, useEffect, useState } from "react"
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function About(props){
    // main-block-background move
    const blockBgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, top: 0, left: 0 });

    useEffect(() => {
      if (blockBgRef.current) {
        const rect = blockBgRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left
        });
      }
    }, []); 
    
    const blockBgEventMove = (event) =>{
        const newX = (event.clientX - dimensions.left)/ dimensions.width -1
        const newY = (event.clientY - dimensions.top)/ dimensions.height -1
        gsap.to(blockBgRef.current,{
            x: newX * 300,
            y: newY * 100,
            ease: "power1.out"
        })
    }

    const blockBgEventLeave = () =>{
        gsap.to(blockBgRef.current,{
            x: 0,
            y: 0,
            ease: "power1.out"
        })
    }

    // scroll to second block
    const scrollTarget = useRef(null);
    function rollToSecondBlock(){
        scrollTarget.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    // second and third block animation
    const secondImage = useRef(null);
    const secondText = useRef(null);
    const thirdImage = useRef(null);
    const thirdText = useRef(null);
    const blcok2Title = useRef(null)
    const blcok3Title = useRef(null)    

    const scrollLeft = (ref) =>{
        gsap.fromTo(ref.current,{
            xPercent: -100,
            opacity:0
        },{
            scrollTrigger:{
                trigger: ref.current,
                scrub: true,
                start: 'top bottom',
                end: 'bottom 70%'
            },
            xPercent: 0,
            opacity: 1,
            ease: "power4.out"
        })
    }

    const scrollRight = (ref) =>{
        gsap.fromTo(ref.current,{
            xPercent: 100,
            opacity:0
        },{
            scrollTrigger:{
                trigger: ref.current,
                scrub: true,
                start: 'top bottom',
                end: 'bottom 70%'
            },
            xPercent: 0,
            opacity: 1,
            ease: "power4.out"
        })
    }

    // title
    const blockTitleStroll = (ref) =>{
        gsap.fromTo(ref.current, {
            yPercent: -200,
            opacity: 0
        },{
            yPercent: 0,
            opacity: 1,
            scrollTrigger:{
                trigger: ref.current,
                scrub: true,
                start: 'top 70%',
                end: 'bottom 40%',
            },
        })
    }
    

    useEffect(()=>{
        // left
        scrollLeft(secondImage)
        scrollLeft(thirdText)
        // right
        scrollRight(secondText)
        scrollRight(thirdImage)
        // title
        blockTitleStroll(blcok2Title)
        blockTitleStroll(blcok3Title)
    },[])



    return (
        <div className={`subpage ${props.menuHidden && "subpage-full"}`}>
            <div className="subpage-title">About</div>
            <div className="about-box">
                <div className="main-block" onMouseMove={blockBgEventMove} onMouseLeave={blockBgEventLeave}>
                    <img ref={blockBgRef} className="main-block-background" src="./main-background.png"></img>
                    <div className="main-block-filter"></div>
                    <div className="main-block-text">
                        <p className="block-title">A web-based simulator and database for modelling scenarios of CO2 storage scaleup around the world</p>
                        <p className="main-block-intro">
                            The simulator takes over 80,000 hydrocarbon reservoirs data from The Wood Mackenzie field reservoirs database (Wood Mackenzie, 2018) into the CO2Block model. It will calculate the CO2 storage data mass and the maximum sustainable per-well injection rate under different durations. The project aims to systematically and automatically generate multi-layered, multi-perspective data charts to assist in analyzing the CO2 storage limitations, potential capacities, and other relevant factors across global regional basins. This will provide robust informational support for researchers in different areas, helping them to more effectively assess and plan local CCS strategies.
                        </p>
                    </div>
                    <img src="./arrow_icon.png" className="main-block-arrow" onClick={rollToSecondBlock}/>
                </div>
                <div className="second-block" ref={scrollTarget}>
                    <img className="second-block-image" ref={secondImage} src="./paper-chart.png" />
                    <div className="second-block-text" ref={secondText}>
                        <div className="block-title sub-block-title" ref={blcok2Title}>Global Analysis of Geological Co2 Storage by Pressure-Limited Injection Sites</div>
                        <div className="second-block-intro">
                            We produce a global estimate of CO2 storage resource that accounts for pressure-limits within basin-scale reservoir systems. We use a dynamic physics model of reservoir pressurisation that is sufficiently simple to be incorporated into energy systems models. Our estimates address regionally inconsistent methodologies and the general lack of consideration for pressure limitations in global storage resource estimates. We estimate a maximum pressure-limited resource base and explore scenarios with different injection patterns, and scenarios where the extent of CCS deployment is limited by the history of regional hydrocarbon exploration and the readiness of countries for deployment. 
                        </div>
                        <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4752727" target="_blank" className="about-link">
                            <PaperIcon className="about-link-icon" />
                            paper link
                        </a>
                    </div>
                </div>
                <div className="third-block">
                    <div className="third-block-text" ref={thirdText}>
                        <div className="block-title sub-block-title" ref={blcok3Title}>A tool for first order estimates and optimisation of dynamic storage resource capacity in saline aquifers</div>
                        <div className="second-block-intro">
                        We develop a methodology for the fast assessment of the dynamic storage resource of a reservoir under different scenarios of well numbers and interwell distance. The approach combines the use of a single-well multiphase analytical solution and the superposition of pressure responses to evaluate the pressure buildup in a multiwell scenario. The injectivity is directly estimated by means of a nonlinear relationship between flow-rate and overpressure and by imposing a limiting overpressure, which is evaluated on the basis of the mechanical parameters for failure. The methodology is implemented within a tool, named CO2BLOCK, which can optimise site design for the numbers of wells and spacing between wells. Given its small computational expense, the methodology can be applied to a large number of sites within a region.
                        </div>
                        <a href="https://www.sciencedirect.com/science/article/abs/pii/S1750583621000104?via%3Dihub" target="_blank" className="about-link">
                            <PaperIcon className="about-link-icon" />
                            <div className="about-link-text">paper link</div>
                        </a>
                        <a href="https://github.com/co2block/CO2BLOCK" target="_blank" className="about-link">
                            <CodeIcon className="about-link-icon" />
                            <div className="about-link-text">Github</div>
                        </a>
                    </div>    
                    <img className="third-block-image" ref={thirdImage} src="./model-background.png" />
                </div>
            </div>
        </div>
    )
}
