import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { FacebookProvider } from 'react-facebook';
import Start from './containers/start/start';
import New from './containers/new/new';
import Join from './containers/join/join';
import Play from './containers/play/play';

function App() {
  return (
    <FacebookProvider appId="218439319569862">
      <Router>
        <Switch>
          <Route path="/start" component={Start} />
          <Route path="/new" component={New} />
          <Route path="/join/:gameId" component={Join} />
          <Route path="/join" component={Join} />
          <Route path="/play" component={Play} />
          <Route path="/" component={Start} />
        </Switch>
      </Router>
    </FacebookProvider>
  );
}

export default App;
