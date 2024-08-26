import { NavLink } from "react-router-dom";
import "./nav.css"
import { ReactComponent as EarthIcon } from './earth_icon.svg';
import { ReactComponent as ImageIcon } from './image_icon.svg';
import { ReactComponent as PinIcon } from './pin_alt_icon.svg';
import { ReactComponent as HomeIcon } from './home_icon.svg';


export function Nav(props){
    return(
        <div className={`nav-box ${props.menuHidden? 'closed' : 'open'}`}>
            <div className="nav-div">
                <div className="nav-div-title">General</div>
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-div-figure nav-div-figure-active" : "nav-div-figure"}>
                    <HomeIcon className="nav-div-icon" />
                    About
                </NavLink>
            </div>
            <div className="nav-div">
                <div className="nav-div-title">Raw Data</div>
                <NavLink to="Data" className={({ isActive }) => isActive ? "nav-div-figure nav-div-figure-active" : "nav-div-figure"}>
                    <EarthIcon className="nav-div-icon" />
                    Data
                </NavLink>
                <NavLink to="Distribution" className={({ isActive }) => isActive ? "nav-div-figure nav-div-figure-active" : "nav-div-figure"}>
                    <PinIcon className="nav-div-icon" />
                    Data distribution map
                </NavLink>
            </div>
            {/* <div className="nav-div">
                <div className="nav-div-title">Data Analysis - basin</div>
                <div className='nav-div-figure'>
                    <ImageIcon className="nav-div-icon" />
                    Figure 3
                </div>
                <div className='nav-div-figure'>
                    <ImageIcon className="nav-div-icon" />
                    Figure 5
                </div>
            </div> */}
            <div className="nav-div nav-div-last">
                <div className="nav-div-title">Data Analysis</div>
                <NavLink to="Figure6" className={({ isActive }) => isActive ? "nav-div-figure nav-div-figure-active" : "nav-div-figure"}>
                    <ImageIcon className="nav-div-icon" />
                    Figure 6
                </NavLink>
                <NavLink to="Figure7" className={({ isActive }) => isActive ? "nav-div-figure nav-div-figure-active" : "nav-div-figure"}>
                    <ImageIcon className="nav-div-icon" />
                    Figure 7
                </NavLink>
                <NavLink to="Figure8" className={({ isActive }) => isActive ? "nav-div-figure nav-div-figure-active" : "nav-div-figure"}>
                    <ImageIcon className="nav-div-icon" />
                    Figure 8
                </NavLink>
                <NavLink to="Figure9" className={({ isActive }) => isActive ? "nav-div-figure nav-div-figure-active" : "nav-div-figure"}>
                    <ImageIcon className="nav-div-icon" />
                    Figure 9
                </NavLink>
            </div>
        </div>
    )
}