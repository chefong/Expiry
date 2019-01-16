import React, { Component } from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { defaults } from 'react-chartjs-2'
import Info from '../Info/Info'
import './Chart.css'

// Edited Chart JS's default font settings
defaults.global.defaultFontFamily = 'League Gothic'
defaults.global.defaultFontSize = 16

const d3 = require("d3-fetch")
const csvFile = require('../data.csv')
const green = "#99cc94"
const darkGreenA = "rgb(115, 209, 107)"
const darkGreenB = "rgb(13, 158, 0)"
const darkRedA = "rgb(255, 46, 49)"
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
    activeOverload: undefined,
    totalLoad: 0,
    totalMax: 0,
    selectedIndices: []
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
      loads.push(parseInt(data[i].Load))
      maxes.push(parseInt(data[i].Max))

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

  setElementColor = (activeIndex, elementColor) => {
    let colors = [...this.state.colors]
    let loadValue = this.state.loads[activeIndex]
    let maxValue = this.state.maxes[activeIndex]
    let totalLoad = this.state.totalLoad
    let totalMax = this.state.totalMax
    let selectedIndices = [...this.state.selectedIndices]

    if (elementColor == darkGreenA) {
      colors[activeIndex] = "#13a706"
      selectedIndices.push(activeIndex)

      totalLoad += loadValue
      totalMax += maxValue
    }
    else if (elementColor == darkGreenB) {
      colors[activeIndex] = green
      selectedIndices.splice(selectedIndices.indexOf(activeIndex))

      totalLoad -= loadValue
      totalMax -= maxValue
    }
    else if (elementColor == darkRedA) {
      colors[activeIndex] = "#b6070a"
    }
    else {
      colors[activeIndex] = red
    }

    let totalCurrent = (totalLoad / totalMax) * 100
    totalCurrent = totalCurrent.toFixed(1)
    console.log(selectedIndices)
    this.setState({ colors, totalLoad, totalMax, selectedIndices })
  }

  handleElementClick = e => {
    let chartElement = e[0]

    if (chartElement) {
      let activeIndex = chartElement._index
      let activeCurrent = this.state.currents[activeIndex]
      let activeSpace = this.state.max - activeCurrent
      activeSpace = activeSpace.toFixed(1)
      
      activeSpace < 0.0 ? this.setState({ overloaded: true }) : this.setState({ overloaded: false })

      this.setState({ activeIndex, activeCurrent, activeSpace })

      let elementColor = chartElement._model.backgroundColor
      this.setElementColor(activeIndex, elementColor)
    }
  }

  render() {
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
              <Info 
                overloaded={ this.state.overloaded }
                max={ this.state.max }
                activeCurrent={ this.state.activeCurrent }
                activeSpace={ this.state.activeSpace }
              />
            </div>
          </div>
          <div className="bar-container">
            <div className="row justify-content-center">
              <div className="col-md-10">
                { this.state.names && this.state.loads && this.state.currents && this.state.colors && <HorizontalBar
                  data={
                    {
                      labels: this.state.names,
                      datasets: [{
                        backgroundColor: this.state.colors,
                        data: this.state.currents
                      }]
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
