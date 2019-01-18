import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home/Home';
import Input from './Input/Input'
import './App.css';

class App extends Component {
  state = {
    file: undefined
  }

  handleFileUpload = file => {
    this.setState({ file })
  }
  
  render() {
    return (
      <div className="App">
        <BrowserRouter>
        	<Switch>
            <Route 
              exact path="/" 
              render={ props => <Input {...props} handleFileUpload={ file => this.handleFileUpload(file) }/> }
            />
            <Route 
              path="/home" 
              render={ props => <Home {...props} file={ this.state.file }/> }/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
