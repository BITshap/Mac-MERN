import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Logs from "./Views/logs"
import Login from "./Views/login.jsx"
import Users from "./Views/users.jsx"
import Submission from "./Views/submission"
import Shiela from './Views/shiela';

import 'normalize.css';

const App = () => {
  return (
    <Router>
    <div className="app-container">
      <Routes>
      <Route exact path="/" element={<Login />}></Route>
      <Route path="/users" element={<Users />}></Route>
      <Route path="/submission" element={<Submission />}></Route>
      <Route path="/:username/logs" element={<Logs />}></Route>
      <Route path="/shiela-response" element={<Shiela />}></Route>
      </Routes>    
      </div>
    </Router>
  );
};

export default App;