import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Logs from "./Views/logs"
import Login from "./Views/login.jsx"
import Users from "./Views/users.jsx"
import RocketSpinner from './Views/RocketSpinner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'normalize.css';
import './App.css';

//Lazy Load of Submission Practice
const Submission = React.lazy(() => import ('./Views/submission'))
const Shiela = React.lazy(() => import ('./Views/shiela'))

const App = () => {

  return (
    <Router>
      <div className='app-container'>
        <ToastContainer />
        <Suspense fallback={<RocketSpinner />}>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/Universe" element={<Users />} />
            <Route path="/submission" element={<Submission />} />
            <Route path="/:username/logs" element={<Logs />} />
            <Route path="/sheila-response" element={<Shiela />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;