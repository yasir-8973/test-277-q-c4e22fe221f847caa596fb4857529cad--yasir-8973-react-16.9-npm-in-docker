import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import Quiz from './Quiz';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Switch,  Route,  Link } from 'react-router-dom';

function Mount() {
    return (
        <Router>
            <Switch>
                <Route exact path="/"><Home /></Route>
                <Route path='/quiz/:id' render={(props) => {
                    return ( <Quiz {...props } /> )
                }} />
            </Switch>
        </Router>
    )
}
// BACKEND ENDPOINT BASE URL
// console.log(process.env.REACT_APP_API_URL);

const element = (<Mount/>);

ReactDOM.render(element, document.getElementById("root")
);
serviceWorker.unregister();
