import React from 'react'
import './Title.css'

const expiryLogo = require('../assets/images/Expiry.png')

const Title = () => {
  return (
    <div className="title-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <img id="expiry-logo" src={ expiryLogo } alt="Expiry Logo"/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Title