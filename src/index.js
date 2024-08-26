import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//lenis
// const lenis = new Lenis()

// lenis.on('scroll', (e) => {
//   console.log(e)
// })

// function raf(time) {
//   lenis.raf(time)
//   requestAnimationFrame(raf)
// }

// requestAnimationFrame(raf)

