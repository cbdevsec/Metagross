import React from 'react'
import './mainHome.css'
import Navbar from '../componants/Navbar'
import Footer from '../componants/Footer'

function MainHome() {
  return (
    <>
    <Navbar />
    <div className='home-page'>
        <h1>School Manager Platform</h1>
        <p>Your All-in-one customizable School manager platform</p>
    </div>
    <Footer />
    </>
  )
}

export default MainHome