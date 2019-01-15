import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'
import './Chart.css'

const d3 = require("d3-fetch")
const csvFile = require('../data.csv')

export default class Chart extends Component {
  state = {
    couriers: undefined,
    names: undefined,
    loads: undefined
  }

  componentDidMount = () => {
    d3.csv(csvFile).then(data => {
      let couriers = []
      let names = []
      let loads = []
      
      for (let i = 0; i < data.length; ++i) {
        couriers.push(data[i])
        names.push(data[i].Name)
        loads.push(data[i].Load)
      }

      this.setState({
        couriers,
        names,
        loads
      })
    })
  }

  render() {
    return (
      <div className="chart-container">
        <h1 id="chart-name">Loading Capacities</h1>
        <div className="bar-container">
          { this.state.names && this.state.loads && <Bar
            data={
              {
                labels: this.state.names,
                datasets: [
                  {
                    data: this.state.loads
                  }
                ]
              }
            }
          /> }
        </div>
      </div>
    )
  }
}
