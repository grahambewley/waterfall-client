import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Play from './containers/play/play';
import Start from './containers/start/start';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/start' component={Start}/>
        <Route path='/play' component={Play}/>
        <Route path='/' component={Play}/>
      </Switch>
    </Router>
  )
}

export default App;
