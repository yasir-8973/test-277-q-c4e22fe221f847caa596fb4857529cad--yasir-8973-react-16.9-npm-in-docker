// Basic Imports
import React, { useEffect,useState } from 'react';
import './Home.css';
// Api service
import {config} from './config';
// External Plugin
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';

function Home() {
	// State declaration with default values
	const [QuizData,setQuizData] = useState([]);
	const [loading,setLoading] = useState(false);

	// onload function for getting all data 
	useEffect(() => {		
		GetData();
	},[]);

	// get all data using API
	const GetData = () => {	
		setLoading(true);
        let url = config.api + "/api/quiz/all";
        fetch(url, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "auth-token": "19c4ff12-e027-4320-b844-2cda768714e8",                
            },
        })
        .then(res => res.json())
        .then(res => {
            setQuizData(res);
            setLoading(false);
        }); 
	}

	// looping through a Array to set HTML tags
	const Data = QuizData.map((e,i) => {
		return (
				<div key={i} className="displayFlex quiz-card">
			    	<div className="quiz-items">
			    		<h3 className={`quiz-list-${e.id}`}>{e.name}</h3>
			    		<p className={`quiz-list-desc-${e.id}`}>{e.description}</p>
			    	</div>
			    	<div className="start-button">
			    		<Link to={`/quiz/${e.id}`} className="Link-Btn"><button className={`start-quiz-${e.id}`}>Start</button></Link>
			    	</div>
			    </div>	
		)
	})


    return (
	    <div>
	    	{loading && <LinearProgress />}
	    	<div className="Home-Page-Contents">
		    	<h2>Welcome to CodeJudge</h2>
			    <div className="quiz-card-scroll">	
			    	{Data}	
				</div>
			</div>			
	    </div>
    );
}

export default Home;
