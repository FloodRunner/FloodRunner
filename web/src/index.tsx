import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./Contexts/auth0-context";
import { FloodRunnerProvider } from "./Contexts/floodrunner-context";
import history from "./Utils/history";

ReactDOM.render(
  <Auth0Provider>
    <FloodRunnerProvider>
      <Router history={history}>
        <App />
      </Router>
    </FloodRunnerProvider>
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
