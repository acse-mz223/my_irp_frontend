
import React from "react";
import {Outlet} from "react-router-dom"
import './MainPage.css';
import { Header } from './header';
import { Nav } from './nav';

export function MainPage(props) {

  
  return (
    <div>
      <Header setMenuHidden={props.setMenuHidden} menuHidden={props.menuHidden}/>
      <div className='main-body'>
          <Nav menuHidden={props.menuHidden}/>
          {props.menuHidden || <div className="fake-nav"/>}
          <Outlet/>
      </div>
    </div>
  );
}


