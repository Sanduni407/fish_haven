import React, { useState } from 'react'
import './Navbar.css'
import { Link } from "react-router-dom";

const Navbar = () => {

    const[menu,setMenu] = useState("home");


  return (
    <div className='navbar'>
    <Link to='/'><img src='' alt=''  className='logo'/></Link>
    <ul className="navbar-menu">
       <Link to='/'  onClick={()=>setMenu("home")} className={menu==="home"?"active":""}  >Home</Link>
       <a  href='#explore-menu' onClick={()=>setMenu("Collection")} className={menu==="Collection"?"active":""}>Fish Varities</a>
       <a   href='#app-download' onClick={()=>setMenu("aboutus")} className={menu==="aboutus"?"active":""}>About Us</a>
       <a  href='#footer'  onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>contact us</a>
       <Link to='/exporter-register'  onClick={()=>setMenu("exporter")} className={menu==="exporter"?"active":""}  >Register as an exporter</Link>
    </ul>
   <div className='navbar-right'>
      
       <Link to='/login'><button >sign in</button></Link>
         
    
      
   </div>
</div>
  )
}

export default Navbar
