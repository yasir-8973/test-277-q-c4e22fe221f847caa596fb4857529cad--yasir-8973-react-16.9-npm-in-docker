// Basic Imports
import React, {useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import './Quiz.css';
// API service
import {config} from './config';
// External Plugin
import { Link, withRouter } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Radio from '@material-ui/core/Radio';
import Progress from 'react-progressbar';


function Home(props) {
  // State declaration with default values
  const [loading,setLoading] = useState(false);
  const [QuizTypeHeader,setQuizTypeHeader]=useState("");
  const [QuizQuestionData,setQuizQuestionData] = useState([]);
  const [seconds,setSeconds] = useState(15);
  const [questionID,setQuestionID]=useState(0);
  const [questionHeader,setquestionHeader]=useState("");
  const [answers,setAnswers] = useState([]);
  const [selectedValue, setSelectedValue] = React.useState('a');
  const [CurrentQuestionArr,setCurrentQuestionArr] = useState(0);  
  
  const [FinalAnswers,setFinalAnswers]=useState([]);
  const [ShowQuestion,setShowQuestion]=useState(true);

  const [Score,setScore]=useState("");
  const [CorrectAns,setCorrectAns]=useState([]);

  const [ProgressLoader,setProgressLoader]=useState(true);
  const [ProgressWidth,setProgressWidth]=useState(1);  
  
  const [ResetQuestion,setResetQuestion]=useState(false);
  
  // onload function for getting id from query string  
  useEffect(() => {		
    let url = window.location.href;
    let splitID = url.split('quiz/');    
      GetData(splitID[1]);    
	},[]);


    // get all data using API
  	const GetData = (id) => {	
  		setLoading(true);
          let url = config.api + `/api/quiz-questions/all/${id}`;
          fetch(url, {
              method: "GET",
              headers: { 
                  "Content-Type": "application/json",
                  "auth-token": "19c4ff12-e027-4320-b844-2cda768714e8",                
              },
          })
          .then(res => res.json())
          .then(res => {
              setQuizQuestionData(res.questions);
              setLoading(false);  
              CurrentQuestion(res.questions[0]);
              setCurrentQuestionArr(0);
              setQuizTypeHeader(res.name);
              ProgressBarFunc(); 
          }); 
    }    

  // get current question 
  function CurrentQuestion(res){      
      if(res){
        setquestionHeader(res.name);
        setAnswers(res.options.split(","));
      }
    
  }

  // to save the selected values using API
  function SaveAnswers(val,id){
    setLoading(true);
        let url = config.api + `/api/user/quiz-score`;
        let data = {
            "quiz_id": id,
            "mappings": val
        }
        fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "auth-token": "19c4ff12-e027-4320-b844-2cda768714e8",                
            },
            body: JSON.stringify(data) 
        })
        .then(res => res.json())
        .then(res => {
            setScore(res.score);
            setCorrectAns(res.questions);
            setShowQuestion(false);
            setLoading(false);
        }); 
  }

  // to check wheather the time is over
  useEffect(() => {
    if(ResetQuestion){
        NoChange();
    }
  },[ResetQuestion]);

  // on no radio button has change event
  const NoChange = (event) => {
      if(FinalAnswers.length !== QuizQuestionData.length){   
        CurrentQuestion(QuizQuestionData[CurrentQuestionArr+1]);
        setCurrentQuestionArr(CurrentQuestionArr+1);
        setResetQuestion(false);        
        FinalAnswers.push({ques_id:QuizQuestionData[CurrentQuestionArr].id,submitted_option:''});
      }
      if(FinalAnswers.length == QuizQuestionData.length){      
        setFinalAnswers(FinalAnswers);
        if(QuizQuestionData[CurrentQuestionArr]){
          SaveAnswers(FinalAnswers,QuizQuestionData[CurrentQuestionArr].quiz);
        }        
      }
  }

  // on radio button change event
  const RadioBtnChange = (event) => {
    setSelectedValue(event.target.value); 
    setResetQuestion(true);   
    ProgressBarFunc();
  };

  // setting timer 
  function ProgressBarFunc() {
    let Progressdelay = 500;
    let Timerdelay = 1000;
    let width = 0;
    let second = 15;      


    let ProgressID = setTimeout(function request() {          
        if(Math.floor(width) >= 100){          
          clearInterval(ProgressID);            
          setProgressWidth(0);
          ProgressBarFunc();  
          setResetQuestion(true);           
          return false;
        }else{
          width=width+3.5;       
          setProgressWidth(Math.floor(width));
        }          
        ProgressID = setTimeout(request, Progressdelay);
    }, Progressdelay);

    let timerId = setTimeout(function request() {          
        if(Math.floor(width) >= 100){
          clearInterval(timerId);
          setSeconds(15);
          return false;
        }else{
          second = second - 1;
          setSeconds(second);
        }          
        timerId = setTimeout(request, Timerdelay);
    }, Timerdelay);        
  }

  // looping through a Array to set HTML tags
  const answerOptions = answers.map((e,i) => {    
    return (
      <div key={i} className={`answerDiv answer-value-${i+1}`}>
          <Radio
            checked={selectedValue === e}
            onChange={RadioBtnChange}
            value={e}            
          /> {e}
      </div>
    )
  });

  // looping through a Array to set HTML tags
  const CorrectAnswers = CorrectAns.map((e,i) => {    
    return (
      <div key={i} className="answerDiv">
          <div className={`finalans question-${i+1}`} >Question : <span>{QuizQuestionData[i].name}</span></div>
          <div className={`finalans submitted-answer-${i+1}`} >Your Answer : <span>{e.submitted_option}</span></div>
          <div className={`finalans correct-answer-${i+1}`} >Correct Answer : <span>{e.correct_option}</span></div>
      </div>
    )
  });

  return (
    <div >
        {loading && <LinearProgress />}
          <div className="QuizQuestionHeader">
            <h1> {QuizTypeHeader}</h1>
          </div>
          {ShowQuestion ?
              <div>
                <div id="Progress">
                  {ProgressLoader && <Progress completed={ProgressWidth} />}
                  <div className="time-bar">Time Remaining: 0:{seconds > 9 ? seconds : "0"+ seconds}/0:15 seconds</div>            
                </div>
                <div className="questioncard">
                  <div className="question">{questionHeader}</div>
                  {answerOptions}
                </div>
              </div>
            :   
              <div className="Result">
                <h1 className="score">Your Score is {Score}</h1>      
                <div className="questioncard">
                  <div className="answers">Answers</div>
                  {CorrectAnswers}
                </div>
              </div>
           }
    </div>
  );
}

export default withRouter(Home);
