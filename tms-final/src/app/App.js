import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import { LoginPage, RegistrationPage, UsersPage, TasksPage, HomePage, } from '../pages';
import './App.sass';

function App() {

  return (
    <div className='App'>
      <Router>
        <Route exact path='/'>
          <HomePage />
        </Route>
        <Route path='/login'>
          <LoginPage />
        </Route>
        <Route path='/registration'>
          <RegistrationPage />
        </Route>
        <Route path='/users'>
          <UsersPage />
        </Route>
        <Route path='/tasks'>
          <TasksPage />
        </Route>
      </Router>
    </div>
  );
}

export default App;
