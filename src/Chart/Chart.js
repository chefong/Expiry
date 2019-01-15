import React, { Component } from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import './Chart.css'

const d3 = require("d3-fetch")
const csvFile = require('../data.csv')
const green = "#99cc94"
const red = "#e66668"

export default class Chart extends Component {
  state = {
    couriers: undefined,
    names: undefined,
    loads: undefined,
    colors: undefined
  }

  updateCouriers = data => {
    let couriers = []
    let names = []
    let loads = []
    let colors = []

    for (let i = 0; i < data.length; ++i) {
      couriers.push(data[i])
      names.push(data[i].Name)
      loads.push(data[i].Load)

      data[i].Load <= 100 ? colors.push(green) : colors.push(red)
    }

    this.setState({ couriers, names, loads, colors })
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

  render() {
    return (
      <div className="chart-container">
        <div class="container-fluid">
          <div class="row justify-content-center">
            <div class="col-md-12">
              <h1 id="chart-name">Loading Capacities</h1>
            </div>
          </div>
          <div className="filters-container">
            <form onSubmit={ this.handleSubmit }>
              <div class="row justify-content-center">
                <div class="col-md-2">
                  <select className="form-control" id="sortBy">
                    <option>Low - High</option>
                    <option>High - Low</option>
                    <option>A - Z</option>
                    <option>Z - A</option>
                  </select>
                </div>
                <div className="col-md-1">
                  <button type="submit" className="btn btn-secondary">Submit</button>
                </div>
              </div>
            </form>
          </div>
          <div className="bar-container">
            <div class="row justify-content-center">
              <div class="col-md-10">
                { this.state.names && this.state.loads && this.state.colors && <HorizontalBar
                  data={
                    {
                      labels: this.state.names,
                      datasets: [
                        {
                          backgroundColor: this.state.colors,
                          data: this.state.loads
                        }
                      ]
                    }
                  }
                  options={
                    {
                      legend: {
                        display: false
                      }
                    }
                }
                /> }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
