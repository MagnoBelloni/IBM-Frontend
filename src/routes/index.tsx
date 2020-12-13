import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Routes';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Deposit from '../pages/Deposit';
import Withdraw from '../pages/Withdraw';
import Transfer from '../pages/Transfer';
import Statement from '../pages/Statement';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/deposit" component={Deposit} isPrivate />
    <Route path="/withdraw" component={Withdraw} isPrivate />
    <Route path="/transfer" component={Transfer} isPrivate />
    <Route path="/statement" component={Statement} isPrivate />
  </Switch>
);

export default Routes;
