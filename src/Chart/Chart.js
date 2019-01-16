import React, { Component } from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import './Chart.css'

const d3 = require("d3-fetch")
const csvFile = require('../data.csv')
const green = "#99cc94"
const red = "#e66668"
const options = {
                  legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                  }
                }

export default class Chart extends Component {
  state = {
    couriers: undefined,
    names: undefined,
    loads: undefined,
    maxes: undefined,
    currents: undefined,
    colors: undefined,
    max: 90.0,
    overloaded: false,
    activeIndex: undefined,
    activeCurrent: undefined,
    activeSpace: undefined,
    activeOverload: undefined
  }

  updateCouriers = data => {
    let couriers = []
    let names = []
    let loads = []
    let colors = []
    let maxes = []
    let currents = []

    for (let i = 0; i < data.length; ++i) {
      couriers.push(data[i])
      names.push(data[i].Name)
      loads.push(data[i].Load)
      maxes.push(data[i].Max)

      let current = (data[i].Load / data[i].Max) * 100
      current = current.toFixed(1)

      currents.push(current)

      current <= this.state.max ? colors.push(green) : colors.push(red)
    }

    this.setState({ couriers, names, loads, colors, maxes, currents })
  }

  componentDidMount = () => {
    d3.csv(csvFile).then(data => {
      this.updateCouriers(data)
    })
  }

  onHLSelect = () => {
    let data = this.state.couriers

    data.sort((a, b) => {
      let loadA = a.Load
      let loadB = b.Load

      if (loadA < loadB) return 1

      return -1
    })
    
    this.updateCouriers(data)
  }

  onLHSelect = () => {
    let data = this.state.couriers

    data.sort((a, b) => {
      let loadA = a.Load
      let loadB = b.Load

      if (loadA > loadB) return 1

      return -1
    })
    
    this.updateCouriers(data)
  }

  onAZSelect = () => {
    let data = this.state.couriers

    data.sort((a, b) => {
      let nameA = a.Name
      let nameB = b.Name

      if (nameA > nameB) return 1

      return -1
    })
    
    this.updateCouriers(data)
  }

  onZASelect = () => {
    let data = this.state.couriers

    data.sort((a, b) => {
      let nameA = a.Name
      let nameB = b.Name

      if (nameA < nameB) return 1

      return -1
    })
    
    this.updateCouriers(data)
  }

  handleSubmit = e => {
    e.preventDefault()

    let sortOption = e.target.sortBy.value
    switch(sortOption) {
      case "Low - High":
        this.onLHSelect()
        break;
      case "High - Low":
        this.onHLSelect()
        break;
      case "A - Z":
        this.onAZSelect()
        break;
      default:
        this.onZASelect()
    }
  }

  handleElementClick = e => {
    if (e[0]) {
      let activeIndex = e[0]._index
      let activeCurrent = this.state.currents[activeIndex]
      let activeSpace = this.state.max - activeCurrent
      activeSpace = activeSpace.toFixed(1)
      
      activeSpace < 0.0 ? this.setState({ overloaded: true }) : this.setState({ overloaded: false })

      this.setState({ activeIndex, activeCurrent, activeSpace })
    }
  }

  render() {
    // Set the "space available" color depending on overload status
    let classColor = "grey"
    if (this.state.overloaded) {
      classColor = "red"
    }

    return (
      <div className="chart-container">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div class="row justify-content-center">
                <h1 id="chart-name">Loading Capacities</h1>
              </div>
              <div className="row justify-content-center">
                <form className="form-inline" onSubmit={ this.handleSubmit }>
                  <select className="form-control" name="sortBy" id="sortBy">
                    <option>Low - High</option>
                    <option>High - Low</option>
                    <option>A - Z</option>
                    <option>Z - A</option>
                  </select>
                  <button type="submit" className="btn btn-secondary">Submit</button>
                </form>
              </div>
            </div>
            <div className="col-md-5">
              <div class="info-container">
                <div className="row">
                  <div className="col-md-5">
                    <p className="info">Maximum: { this.state.max }%</p>
                  </div>
                  <div className="col-md-5">
                    <p className="info">Space Available: <span className={ classColor }>{ this.state.activeSpace }%</span></p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-5">
                    <p className="info">Current: { this.state.activeCurrent }%</p>
                  </div>
                  <div className="col-md-5">
                    { this.state.overloaded && <p className="info" id="overloaded">OVERLOADED!</p> }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bar-container">
            <div className="row justify-content-center">
              <div className="col-md-10">
                { this.state.names && this.state.loads && this.state.colors && <HorizontalBar
                  data={
                    {
                      labels: this.state.names,
                      datasets: [
                        {
                          backgroundColor: this.state.colors,
                          data: this.state.currents
                        }
                      ]
                    }
                  }
                  options={ options }
                  getElementAtEvent={ this.handleElementClick }
                /> }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
