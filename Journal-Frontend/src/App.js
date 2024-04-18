import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Logs from "./Views/logs"
import Login from "./Views/login.jsx"
import Users from "./Views/users.jsx"
import RocketSpinner from './Views/RocketSpinner';
import Guts from "./Views/Guts.jsx"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'normalize.css';
import './App.css';
import './Views/Guts.css'

//Lazy Load of Submission Practice
const Submission = React.lazy(() => import ('./Views/submission'))
const Shiela = React.lazy(() => import ('./Views/shiela'))

const App = () => {

  const [hasToastBeenShown, setHasToastBeenShown] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (!hasToastBeenShown && window.innerWidth < 525 && /Macintosh/.test(navigator.userAgent)) {
        // Update state so the toast isn't shown again
        setHasToastBeenShown(true);

        // Trigger the toast warning
        toast.warn("JournalMe is best used on a full screen size!");
      } else if (window.innerWidth >= 525) {
        // Reset the state when the screen is larger than 525px 
        // (optional, if you want to notify again when the user resizes back and then goes small again)
        setHasToastBeenShown(false);
      }
    }

    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [hasToastBeenShown]);
  

  return (
    <Router>
      <div className='app-container'>
        <ToastContainer />
        <Suspense fallback={<RocketSpinner />}>
          <Routes>
            <Route exact path="/" element={<Guts />} />
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