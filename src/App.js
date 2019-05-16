import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import { connect } from 'react-redux'

import Home from './components/Home';
import ToDo from './components/ToDo';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <div className="header">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li><Link to="/todo">ToDo</Link></li>
            </ul>
          </div>
          <Route path="/" exact component={Home} />
          <Route path="/todo" component={ToDo} />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state = {}) => {
  return { ...state };
};

export default connect(mapStateToProps)(App)