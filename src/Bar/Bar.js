import React from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { defaults } from 'react-chartjs-2'
import './Bar.css'

// Edited Chart JS's default font settings
defaults.global.defaultFontFamily = 'League Gothic'
defaults.global.defaultFontSize = 16

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

const Bar = props => {
  return (
    <div className="bar-container">
      <div className="row justify-content-center">
        <div className="col-md-10">
          { props.names && props.loads && props.currents && props.colors && <HorizontalBar
            data={
              {
                labels: props.names,
                datasets: [{
                  backgroundColor: props.colors,
                  data: props.currents
                }]
              }
            }
            options={ options }
            getElementAtEvent={ props.handleElementClick }
          /> }
        </div>
      </div>
    </div>
  )
}

export default Bar