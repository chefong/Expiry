import React, { Component } from 'react'
import Title from '../Title/Title'
import { Redirect } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import './Input.css'

const uploadIcon = require('../assets/images/upload.png')

export default class Input extends Component {
  state = {
    file: undefined,
    fileReceived: false,
    fileName: undefined
  }

  onDrop = acceptedFiles => {
    if (acceptedFiles.length > 1) {
      alert("Too many files received")
    }
    else {
      console.log(acceptedFiles[0].name)
      this.setState({ 
        file: acceptedFiles[0],
        fileName: acceptedFiles[0].name
      })
    }
  }

  handleUploadSubmit = e => {
    e.preventDefault()

    if (this.state.file) {
      let file = this.state.file
      this.props.handleFileUpload(file)

      this.setState({ fileReceived: true })
    }
  }

  render() {
    if (this.state.file && this.state.fileReceived) {
      return <Redirect to="/home"/>
    }

    return (
      <div className="input-container">
        <div class="container-fluid">
          <Title />
          <div className="upload-caption-container">
            <p id="upload-caption">Click on the upload icon to upload your CSV file.</p>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-1">
              <Dropzone onDrop={ this.onDrop }>
                {({getRootProps, getInputProps, isDragActive}) => {
                  return (
                    <div
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      {
                        isDragActive ?
                          <p>Drop files here...</p> :
                          <div className="upload-container">
                            <img id="upload-icon" src={ uploadIcon } alt=""/>
                          </div>
                      }
                    </div>
                  )
                }}
              </Dropzone>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="file-name-container">
                { this.state.fileName && <p id="file-name">{ this.state.fileName }</p> }
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-2">
              <div class="upload-button-container">
                <button className="btn btn-secondary" type="submit" onClick={ this.handleUploadSubmit }>Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
