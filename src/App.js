import React, { Component } from 'react';
import './App.css';

import Title from './Title/Title';
import Chart from './Chart/Chart';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Title/>
        <Chart/>
      </div>
    );
  }
}

export default App;
