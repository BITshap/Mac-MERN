import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './Views/login.jsx';
import Users from './Views/users.jsx';

const App = () => {
  return (
    <Router>
    <div>
      <Routes>
      <Route exact path="/" element={<Login />}></Route>
      <Route path="/users" element={<Users />}></Route>
      </Routes>    
      </div>
    </Router>
  );
};

export default App;
