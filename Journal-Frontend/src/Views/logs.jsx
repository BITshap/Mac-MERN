import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {toast} from 'react-toastify';
import RocketSpinner from './RocketSpinner';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_JOURNAL_ME_API_URL;
console.log(baseUrl)

const Logs = () => {
  const location = useLocation();
  const { username, userId } = location.state || {};
  console.log('userId:', userId)
  console.log('Username:', username)
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showFullLogs, setShowFullLogs] = useState({});

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const [logs, setLogs] = useState([]);
  const [timestamps, setTimestamps] = useState([])
  const [score, setScore] = useState(0)

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  useEffect(() => {
    if (!token) {
        const handleNavigation = () => {
            navigate('/');
        };

        const alertTimeout = setTimeout(() => {
            toast.error('Ground control to Major Tom, we must login!');
            handleNavigation();
        }, 0);

        return () => clearTimeout(alertTimeout);
    } else if (!userId || !username) {
        const handleNavigation = () => {
            navigate('/');
        };

        const alertTimeout = setTimeout(() => {
            toast.warning("Oops! Looks like you're trying to access a feature a little bit early. Please re-login!");
            handleNavigation();
        }, 0);

        return () => clearTimeout(alertTimeout);
    } else {
        const getLogs = async () => {
            try {
                const response = await axios.get(`${baseUrl}/users/${userId}/paged-logs?page=${currentPage}&limit=10`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const { logs, timestamps, newScore, totalPages } = response.data;
                setScore(newScore);
                setLogs(logs);
                setTimestamps(timestamps);
                setTotalPages(totalPages);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching logs:", error);
                setLoading(false);
            }
        };

        getLogs();
    }
}, [token, userId, username, currentPage, navigate]);

const handleBackToLogs = () => {
  navigate('/submission', {state: {username, userId, score}});
};

return (
  <div className="logs-container">
    <h1 id="Welcome_Text"><span className="shimmer-effect">{username}'s</span> most recent entries:</h1>
    <h2 id="Welcome_Text">Your individual score too: {score}</h2>
    {loading ? (
      <div className="spinner-container">
        <RocketSpinner />
      </div>
    ) : (
      <>
        {logs.map((log, index) => {
          const isLongLog = log.length > 100; // This checks if the log is longer than 100 characters.
          const shouldTruncate = isLongLog && !showFullLogs[index];

          return (
            <div className="logs-contain">
            <div key={index} className="log-entry">
              <span id="Welcome_Text">
                {shouldTruncate ? `${log.substring(0, 100)}...` : log}
                {isLongLog && (
                  <button 
                    className="view-toggle" 
                    onClick={() => setShowFullLogs(prev => ({ ...prev, [index]: !prev[index] }))}
                  >
                    {shouldTruncate ? 'View More' : 'View Less'}
                  </button>
                )}
              </span>
              <span id="Welcome_Text">{formatDate(new Date(timestamps[index]))}</span>
            </div>
            </div>
          );
          
        })}
       <div className="pagination-controls">
    <Button className="pagination-button" onClick={() => setCurrentPage(1)}>Recent Entries</Button>
    <Button className="pagination-button" onClick={() => setCurrentPage(prev => (prev === 1 ? totalPages : prev - 1))}>Previous</Button>
    <span id="Page_Text">Page {currentPage} of {totalPages}</span>
    <Button className="pagination-button" onClick={() => setCurrentPage(prev => (prev === totalPages ? 1 : prev + 1))}>Next</Button>
    <Button className="pagination-button" onClick={() => setCurrentPage(totalPages)}>First Entries</Button>
      </div>
      </>
    )}
    <div className="pagination-controls spacing-controls">
    <Button  type="button" onClick={handleBackToLogs}>Journaling</Button>
    <Button  onClick={() => navigate('/Universe', { state: { userId, username, score } })}>Universe</Button>
    </div>
  </div>
);
};

export default Logs;

/*logs.map((log, index) => (
  <div key={index}>
    <p id="Welcome_Text">{log} {formatDate(new Date(timestamps[index]))}</p>
  </div>
))

<h1 id="Welcome_Text"> {username}'s most recent entries:</h1>
    <h2 id="Welcome_Text">Your individual score too: {score}</h2>
*/