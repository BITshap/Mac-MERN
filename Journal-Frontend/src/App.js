import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './Views/login.jsx';
import Users from './Views/users.jsx';
import Submission from './Views/submission'

const App = () => {
  return (
    <Router>
    <div>
      <Routes>
      <Route exact path="/" element={<Login />}></Route>
      <Route path="/users" element={<Users />}></Route>
      <Route path="/submission" element={<Submission />}></Route>
      </Routes>    
      </div>
    </Router>
  );
};

export default App;
