import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';



const Submission = () => {
    const [username, setUsername] = useState('')
    const [score, setScore] = useState()


    const handleSubmission = aync (e) => {
        e.preventDefault();
    }


}