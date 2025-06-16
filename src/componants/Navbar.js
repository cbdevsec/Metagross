import React from 'react'
import './navbar.css'
import Logo from './../Assets/schoollogo1.png'
import {Link} from 'react-router-dom'

function Navbar() {
  return (
    <nav>
        <div className='navbar-style'>
            <div className='logo-area'>
                <Link><img src={Logo}></img></Link>
            </div>
            <div className='links-area'>
                <Link to='/home'><h3>Home page</h3></Link>
                <Link to='/dashboard'><h3>Dashboard</h3></Link>
                <Link to='/'><h3>Login/Signup</h3></Link>
            </div>
        </div>
    </nav>
  )
}

export default Navbar