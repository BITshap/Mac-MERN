import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Logs from "./Views/logs"
import Login from "./Views/login.jsx"
import Users from "./Views/users.jsx"
import Shiela from './Views/shiela';
import RocketSpinner from './Views/RocketSpinner';
import 'react-toastify/dist/ReactToastify.css';
import 'normalize.css';
import './App.css';

//Lazy Load of Submission Practice
const Submission = React.lazy(() => import ('./Views/submission'))


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Suspense fallback={<RocketSpinner />}>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/Universe" element={<Users />} />
            <Route path="/submission" element={<Submission />} />
            <Route path="/:username/logs" element={<Logs />} />
            <Route path="/shiela-response" element={<Shiela />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;