import React, { Component } from 'react'
import './Chart.css'

const d3 = require("d3-fetch")
const csvFile = require('../data.csv')

export default class Chart extends Component {

  componentDidMount = () => {
    d3.csv(csvFile).then(function(data) {
      console.log(data)
    })
  }

  render() {
    return (
      <div className="chart-container">
        
      </div>
    )
  }
}
