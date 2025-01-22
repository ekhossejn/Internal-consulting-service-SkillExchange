import React from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Activate from './containers/Activate';
import Layout from './hocs/Layout';

const App = () => (
    <Router>
        <Layout>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/signup' component={Signup} />
                <Route exact path='/activate' component={Activate} />
            </Switch>
        </Layout>
    </Router>
);

export default App;