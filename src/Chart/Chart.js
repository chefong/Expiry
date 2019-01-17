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
    selectedTotalLoad: 0,
    selectedIndices: [],
    largestMax: undefined,
    mergedValue: undefined
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

      let current = ((data[i].Load / data[i].Max) * 100).toFixed(1)

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
      let capacityA = (a.Load / a.Max)
      let capacityB = (b.Load / b.Max)

      if (capacityA < capacityB) return 1

      return -1
    })
    
    this.updateCouriers(data)
  }

  onLHSelect = () => {
    let data = this.state.couriers

    data.sort((a, b) => {
      let capacityA = (a.Load / a.Max)
      let capacityB = (b.Load / b.Max)

      if (capacityA > capacityB) return 1

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

    // Clear values whenever a filter is submitted
    this.setState({
      selectedTotalLoad: 0,
      largestMax: undefined
    })
  }

  setLargestMax = selectedIndices => {
    let maxes = this.state.maxes
    let largestMax = maxes[selectedIndices[0]]

    for (let i = 0; i < selectedIndices.length; ++i) {
      let index = selectedIndices[i]
      if (maxes[index] > largestMax) {
        largestMax = maxes[index]
      }
    }

    return largestMax
  }

  setElementColor = (activeIndex, elementColor) => {
    let colors = [...this.state.colors]
    let loadValue = this.state.loads[activeIndex]
    let maxValue = this.state.maxes[activeIndex]
    let selectedTotalLoad = this.state.selectedTotalLoad
    let selectedIndices = [...this.state.selectedIndices]
    let largestMax = this.state.largestMax

    if (elementColor == darkGreenA) { // If the green bar element is selected
      colors[activeIndex] = "#13a706"
      selectedIndices.push(activeIndex)

      if (selectedIndices.length == 1)  {
        this.setState({ largestMax: maxValue })
      }
      else {
        largestMax = this.setLargestMax(selectedIndices)
      }

      selectedTotalLoad += loadValue
    }
    else if (elementColor == darkGreenB) { // If the green bar element is deselected
      colors[activeIndex] = green
      selectedIndices.splice(selectedIndices.indexOf(activeIndex))
      largestMax = this.setLargestMax(selectedIndices)

      selectedTotalLoad -= loadValue
    }
    else if (elementColor == darkRedA) {
      colors[activeIndex] = "#b6070a"
    }
    else {
      colors[activeIndex] = red
    }

    let mergedValue = ((selectedTotalLoad / largestMax) * 100).toFixed(1)

    this.setState({ colors, selectedTotalLoad, selectedIndices, largestMax, mergedValue })
  }

  handleElementClick = e => {
    let chartElement = e[0]
    let currents = this.state.currents
    let max = this.state.max

    if (chartElement) {
      let activeIndex = chartElement._index
      let activeCurrent = currents[activeIndex]
      let activeSpace = (max - activeCurrent).toFixed(1)
      
      activeSpace < 0.0 ? this.setState({ overloaded: true }) : this.setState({ overloaded: false })

      this.setState({ activeIndex, activeCurrent, activeSpace })

      let elementColor = chartElement._model.backgroundColor
      this.setElementColor(activeIndex, elementColor)
    }
  }

  handleMergeClick = e => {
    e.preventDefault()

    let selectedTotalLoad = this.state.selectedTotalLoad
    let largestMax = this.state.largestMax
    let mergedValue = this.state.mergedValue

    console.log("selectedTotalLoad", selectedTotalLoad)
    console.log("largestMax", largestMax)
    
    if (mergedValue > 90) alert("overload")
  }

  render() {
    let mergeClassColor = "green"
    if (this.state.mergedValue > 90) {
      mergeClassColor = "red"
    }

    return (
      <div className="chart-container">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="row justify-content-center">
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
          <div className="merge-container">
            { this.state.selectedIndices.length > 1 && <div className="row justify-content-center">
              <div class="col-md-3">
                <button className="btn btn-secondary" onClick={ this.handleMergeClick }>Merge</button>
              </div>
              <div className="col-md-3">
                <p id="merge-info">Merged Capacity: <span className={ mergeClassColor }>{ this.state.mergedValue }%</span></p>
              </div>
            </div> }
          </div>
        </div>
      </div>
    )
  }
}
