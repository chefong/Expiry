import React from 'react'
import { NavLink } from 'react-router-dom'
import './Title.css'

const expiryLogo = require('../assets/images/Expiry.png')

const Title = () => {
  return (
    <div className="title-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <NavLink to="/">
              <img id="expiry-logo" src={ expiryLogo } alt="Expiry Logo"/>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Title