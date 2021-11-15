import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { HomeRoute } from './routes';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={HomeRoute} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
