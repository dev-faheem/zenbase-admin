import "./styles/index.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routes from "./data/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "./config";
import axios from "axios";

axios.defaults.baseURL = config.api;

function App() {
  return (
    <>
      <Router>
        <Switch>
          {routes.map((route, index) => (
            <Route {...route} key={index} />
          ))}
        </Switch>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
