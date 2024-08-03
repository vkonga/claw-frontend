import {BrowserRouter,Route,Switch} from 'react-router-dom'
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import UpdateTask from './components/UpdateTask';
import './App.css'
const App = () => (
  <>
    <h1 className='todos' >TODOS LIST APPLICATION</h1>
    <BrowserRouter>
      <Switch>
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/" component={Home} />
        <Route exact path="/update-task/:taskId" component={UpdateTask} />
    </Switch>
  </BrowserRouter>
  </>
)

export default App;
