import "./header.css"
import { ReactComponent as MeunIcon } from './menu_icon.svg';
import gsap from 'gsap';


export function Header(props){
  function menuClick(){
    // change state
    props.setMenuHidden((preValue) =>{
      return !preValue
    })
  }
    return(
        <header className="header">
          <div className='header-icon-div'>
            <div className='header-menu' onClick={menuClick}>
              <span className={`header-menu-dash ${props.menuHidden? "": "header-menu-dash-1"}`}></span>
              <span className={`header-menu-dash ${props.menuHidden? "": "header-menu-dash-2"}`}></span>
              <span className={`header-menu-dash ${props.menuHidden? "": "header-menu-dash-3"}`}></span>
            </div>
            <img className='header-icon' src="./logo.jpg" />
          </div>
          <div className='header-title'>CO2 Block  Preload Analysis System </div>
          <div className='header-signin-button'></div>
        </header>

    )
}