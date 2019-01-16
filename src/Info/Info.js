import React from 'react'
import './Info.css'

const Info = props => {
  let classColor = "green"
  if (props.overloaded) {
    classColor = "red"
  }

  return (
    <div className="info-container">
      <div className="row">
        <div className="col-md-5">
          <p className="info">Maximum: { props.max }%</p>
        </div>
        <div className="col-md-5">
          <p className="info">Space Available: <span className={ classColor }>{ props.activeSpace }%</span></p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-5">
          <p className="info">Current: { props.activeCurrent }%</p>
        </div>
        <div className="col-md-5">
          { props.overloaded && <p className="info" id="overloaded">OVERLOADED!</p> }
        </div>
      </div>
    </div>
  )
}

export default Info
