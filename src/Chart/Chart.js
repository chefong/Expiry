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

  onHLClick = () => {
    let data = this.state.couriers

    data.sort((a, b) => {
      let loadA = a.Load
      let loadB = b.Load

      if (loadA < loadB) return 1

      return -1
    })
    
    this.updateCouriers(data)
  }

  onLHClick = () => {
    let data = this.state.couriers

    data.sort((a, b) => {
      let loadA = a.Load
      let loadB = b.Load

      if (loadA > loadB) return 1

      return -1
    })
    
    this.updateCouriers(data)
  }

  onAZClick = () => {
    let data = this.state.couriers

    data.sort((a, b) => {
      let nameA = a.Name
      let nameB = b.Name

      if (nameA > nameB) return 1

      return -1
    })
    
    this.updateCouriers(data)
  }

  onZAClick = () => {
    let data = this.state.couriers

    data.sort((a, b) => {
      let nameA = a.Name
      let nameB = b.Name

      if (nameA < nameB) return 1

      return -1
    })
    
    this.updateCouriers(data)
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
            <div className="row justify-content-center">
              <div className="col-md-2">
                <button type="button" className="btn btn-secondary" onClick={ this.onHLClick }>High - Low</button>
              </div>
              <div className="col-md-2">
                <button type="button" className="btn btn-secondary" onClick={ this.onLHClick }>Low - High</button>
              </div>
              <div className="col-md-2">
                <button type="button" className="btn btn-secondary" onClick={ this.onAZClick }>A - Z</button>
              </div>
              <div className="col-md-2">
                <button type="button" className="btn btn-secondary" onClick={ this.onZAClick }>Z - A</button>
              </div>
            </div>
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
                /> }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
