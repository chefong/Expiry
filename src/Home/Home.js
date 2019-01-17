import React, { Component } from 'react'
import Info from '../Info/Info'
import Chart from '../Chart/Chart'
import Filter from '../Filter/Filter'
import './Home.css'

const d3 = require('d3-fetch')
const csvFile = require('../data.csv')
const green = "#99cc94"
const red = "#e66668"
const darkGreenA = "rgb(115, 209, 107)"
const darkGreenB = "rgb(13, 158, 0)"

export default class Home extends Component {
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
    mergedCapacity: undefined,
    overLoadAlert: false
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

  resetSelectedMerged = () => {
    this.setState({
      selectedTotalLoad: 0,
      selectedIndices: [],
      largestMax: undefined,
      mergedCapacity: undefined
    })
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

      if (capacityA < capacityB) {
        return 1
      }

      return -1
    })
    
    this.updateCouriers(data)
  }

  onLHSelect = () => {
    let data = this.state.couriers

    data.sort((a, b) => {
      let capacityA = (a.Load / a.Max)
      let capacityB = (b.Load / b.Max)

      if (capacityA > capacityB) {
        return 1
      }

      return -1
    })
    
    this.updateCouriers(data)
  }

  onAZSelect = () => {
    let data = this.state.couriers

    data.sort((a, b) => {
      let nameA = a.Name
      let nameB = b.Name

      if (nameA > nameB) {
        return 1
      }

      return -1
    })
    
    this.updateCouriers(data)
  }

  onZASelect = () => {
    let data = this.state.couriers

    data.sort((a, b) => {
      let nameA = a.Name
      let nameB = b.Name

      if (nameA < nameB) {
        return 1
      }

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
    let largestMax = 0

    if (elementColor == darkGreenA) { // If the green bar element is selected
      colors[activeIndex] = "#13a706"
      selectedIndices.push(activeIndex)

      // Set the largest maximum of the selected couriers
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
    else { // If the red bar is clicked, nothing should happen
      return
    }

    let mergedCapacity = ((selectedTotalLoad / largestMax) * 100).toFixed(1)

    this.setState({ colors, selectedTotalLoad, selectedIndices, largestMax, mergedCapacity })
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

  getSelectedNames = selectedIndices => {
    let selectedNames = []
    let names = this.state.names

    for (let i = 0; i < selectedIndices.length; ++i) {
      let index = selectedIndices[i]
      selectedNames.push(names[index])
    }

    return selectedNames
  }

  editSelectedCouriers = (selectedIndices, load, color, max, current) => {
    let couriers = [...this.state.couriers]
    let names = [...this.state.names]
    let loads = [...this.state.loads]
    let maxes = [...this.state.maxes]
    let currents = [...this.state.currents]
    let colors = [...this.state.colors]

    // Remove the selected couriers from the states
    for (let i = 0; i < selectedIndices.length; ++i) {
      let index = selectedIndices[i]

      couriers.splice(index, 1)
      names.splice(index, 1)
      loads.splice(index, 1)
      maxes.splice(index, 1)
      currents.splice(index, 1)
      colors.splice(index, 1)
    }

    let mergedName = this.getSelectedNames(selectedIndices).join(", ")
    let mergedCourier = { Name: mergedName, Load: load, Max: max }

    // Add the selected couriers to the states
    couriers.push(mergedCourier)
    names.push(mergedName)
    loads.push(load)
    colors.push(color)
    maxes.push(max)
    currents.push(current)

    this.resetSelectedMerged()
    this.setState({ couriers, names, loads, maxes, currents, colors })
  }

  handleMergeClick = e => {
    e.preventDefault()

    let selectedTotalLoad = this.state.selectedTotalLoad
    let largestMax = this.state.largestMax
    let mergedCapacity= this.state.mergedCapacity
    
    if (mergedCapacity > 90) {
      this.setState({ overLoadAlert: true })
    }
    else {
      this.setState({ overLoadAlert: false })
      let selectedIndices = this.state.selectedIndices.sort().reverse()
      this.editSelectedCouriers(selectedIndices, selectedTotalLoad, green, largestMax, mergedCapacity)
    }
  }

  render() {
    let mergeClassColor = "green"
    if (this.state.mergedCapacity > 90) {
      mergeClassColor = "red"
    }

    return (
      <div className="home-container">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="row justify-content-center">
                <h1 id="chart-name">Loading Capacities</h1>
              </div>
              <Filter handleSubmit={ this.handleSubmit }/>
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
          <Chart 
            names={ this.state.names }
            loads={ this.state.loads }
            currents={ this.state.currents }
            colors={ this.state.colors }
            handleElementClick={ this.handleElementClick }
          />
          <div className="merge-container">
            { this.state.selectedIndices.length > 1 && <div className="row justify-content-center">
              <div className="col-md-3">
                <button className="btn btn-secondary" onClick={ this.handleMergeClick }>Merge</button>
              </div>
              <div className="col-md-3">
                <p id="merge-info">Merged Capacity: <span className={ mergeClassColor }>{ this.state.mergedCapacity }%</span></p>
              </div>
            </div> }
          </div>
          <div className="alert-container">
            <div class="row justify-content-center">
              { this.state.overLoadAlert && <div className="alert alert-danger" role="alert">
                Error: Attempting to overload couriers
              </div> }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
