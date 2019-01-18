import React, { Component } from 'react'
import Title from '../Title/Title'
import { Redirect } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import './Input.css'

const uploadIcon = require('../assets/images/upload.png')
const spinner = require('../assets/images/spinner.svg')

export default class Input extends Component {
  state = {
    file: undefined,
    fileReceived: false,
    fileName: undefined,
    isSingleFile: true,
    isCorrectFile: true,
    isUploading: false
  }

  onDrop = acceptedFiles => {
    let file = acceptedFiles[0]

    this.setState({ isUploading: true })

    if (acceptedFiles.length > 1) {
      this.setState({
        file: undefined,
        fileReceived: false,
        isSingleFile: false,
        isCorrectFile: true
      })
    }
    else {
      this.setState({ 
        file,
        fileName: file.name,
        isSingleFile: true,
        isCorrectFile: true
      })
    }

    this.setState({ isUploading: false })
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
                {({getRootProps, getInputProps}) => {
                  return (
                    <div
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      {
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
            <div class="upload-alert-container">
              { !this.state.isSingleFile && <div class="alert alert-danger" role="alert">
                  Please upload only 1 file!
              </div> }
              { !this.state.isCorrectFile && <div class="alert alert-danger" role="alert">
                  Please upload a CSV file!
              </div> }
              { this.state.isUploading && <div class="spinner-container">
                <img id="spinner" src={ spinner }/>
              </div> }
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
