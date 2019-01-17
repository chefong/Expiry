import React, { Component } from 'react';
import Title from './Title/Title';
import Home from './Home/Home';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Title/>
        <Home/>
      </div>
    );
  }
}

export default App;
