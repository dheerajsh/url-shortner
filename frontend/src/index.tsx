import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import UserApp from './AppUser';
import { store } from './app/store';
import { Provider } from 'react-redux';
import {Redirect , BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import AdminApp from './AppAdmin';

ReactDOM.render(
  <React.StrictMode>
    <Router>
    <Provider store={store}>
    <Switch>
        <Route exact path="/" component={UserApp} />
        <Route exact path="/admin" component={AdminApp} />
    </Switch>
    </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
