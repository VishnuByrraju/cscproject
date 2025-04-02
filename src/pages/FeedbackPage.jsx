import Cookies from 'universal-cookie';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from "../components/NavBar"
import ProgressBar from '../components/ProgressBar';
import DoughtnutComponent from '../components/DoughnutComponent';
import FilterToggle from '../components/FilterToggle';
import LoadingScreenLarge from '../components/LodingScreenLarge';
import LoginSignUpPage from './LoginSignUpPage';
import ContextPopupCard from '../components/ContextPopupCard';

const BASE_URL = "http://localhost:5000"

const cookies = new Cookies();

function FeedbackPage() {

    const accesstoken = cookies.get("access_token");
    const userRole = cookies.get("user_role");
    const userId = cookies.get("userId");

    if(accesstoken === "undefined" || !accesstoken){        
        return (<LoginSignUpPage/>);
    }

    const [isReadingResult, setIsReadingResult] = useState(null);
    const [subjectId, setSubjectId] = useState(null);
    const [JsonResult, setJsonResult] = useState(null);

    useEffect(() => {
        const queryString = window.location.search;
        // Create a URLSearchParams object
        const urlParams = new URLSearchParams(queryString);

        // Retrieve the value of the 'user' parameter
        const subjectId = urlParams.get('subjectId');
        const questionId = urlParams.get('questionId');
        const studentId = urlParams.get('studentId');

        setSubjectId(subjectId);

        fetchResultDataBySubjectAndQuestionID({ subjectId, questionId, studentId});
    }, []); // The effect will run whenever the URL search part changes


    const [accuracyScore, setAccuracyScore] = useState(null);
    const [fluencyScore, setFluencyScore] = useState(null);
    const [prosodyScore, setProsodyScore] = useState(null);
    const [completenessScore, setCompletenessScore] = useState(null);
    const [pronScore, setPronScore] = useState(null);
    

    const [grammarScore, setGrammarScore] = useState(null);
    const [topicScore, setTopicScore] = useState(null);
    const [vocabularyScore, setVocabularyScore] = useState(null);
    const [contentScore, setContentScore] = useState(null);


    const fetchResultDataBySubjectAndQuestionID = async ({subjectId, questionId, studentId}) => {

        try {

          (async () => {
            
              const rawResponse = await fetch('https://55cr1n59r3.execute-api.us-east-2.amazonaws.com/dev/v1/subjects/get_question_results?' + ("subjectId=" + subjectId +
                                                                                  "&questionId=" + questionId +
                                                                                  "&userId=" + userId )  , 
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json', 
                        "Authorization": "Bearer " + accesstoken
                    }
                }
              );

              // Extract JSON content from the response
              const content =  await rawResponse.json();
              console.log("content: ", content);

              if(rawResponse.ok){
                    // console.log("Result : ", content);
                    
                    const resultData = content.results.questionResult;
                    const isMonotonesExist = checkKeyExists(resultData, "monotones");

                    // console.log("isExist monotones:   ", isMonotonesExist);
                    setIsReadingResult(!isMonotonesExist);
                    setJsonResult(resultData)

                    console.log("resultData:", resultData);

                    // setting accuracy score
                    if(!isMonotonesExist){
                        
                        /* Set statics data if Reading */
                        setAccuracyScore(resultData.pronunciationAssessment[0].AccuracyScore);
                        setFluencyScore(resultData.pronunciationAssessment[1].FluencyScore);
                        setCompletenessScore(resultData.pronunciationAssessment[2].CompletenessScore);
                        setPronScore(resultData.pronunciationAssessment[3].PronScore);

                    }else{
                        
                        /* Set statics data if Speaking */
                        setAccuracyScore(resultData.pronunciationAssessment.AccuracyScore);
                        setFluencyScore(resultData.pronunciationAssessment.FluencyScore);
                        setCompletenessScore(resultData.pronunciationAssessment.CompletenessScore);
                        setPronScore(resultData.pronunciationAssessment.PronScore);
                        setProsodyScore(resultData.pronunciationAssessment.ProsodyScore);

                        setGrammarScore(resultData.contentAssessment.GrammarScore);
                        setTopicScore(resultData.contentAssessment.TopicScore);
                        setVocabularyScore(resultData.contentAssessment.VocabularyScore);
                        
                        const avgGramTopicVocabScore =  Number((resultData.contentAssessment.TopicScore + resultData.contentAssessment.GrammarScore + resultData.contentAssessment.VocabularyScore)/3) ;
                        setContentScore(avgGramTopicVocabScore);
                    }

              }else {
                    console.error('Error:', content);
              } 

          })();
          
        } catch (error) {
            console.error('Error:', error);
        }

    };


    //? Error FILTER ENABLED ? States
    const [isMispronounsEnabled, setIsMispronounsEnabled] = useState(false);
    const [isOmmisionEnabled, setIsOmmisionEnabled] = useState(false);
    const [isMonotonInputEnabled, setIsMonotonInputEnabled] = useState(false);
    const [isInsertionEnabled, setIsInsertionEnabled] = useState(false);
    const [isUnexpectedBreakEnabled, setIsUnexpectedBreakEnabled] = useState(false);
    const [isMissingBreakEnabled, setIsMissingBreakEnabled] = useState(false);

    // array of words 
    const [mispronounsWords, setMispronounsWords] = useState([]);
    const [monotonWords, setMonotonWords] = useState([]);
    const [omissionsWords, setOmissionsWords] = useState([]);
    const [insertionWords, setInsertionWords] = useState([]);
    const [unexpectedBreakWords, setUnexpectedBreakWords] = useState([]);
    const [missingBreaksWords, setMissingBreaksWords] = useState([]);
    const [wordPhonemesArray, setWordPhonemesArray] = useState([]);

    // Function to add keys to wordPhonemesArray without duplicates
    const addWordPhonemesArray = () => {
        const totalWordPhonemesArray = JsonResult.word_phonemes;
        const existingKeys = new Set(wordPhonemesArray);
    
        totalWordPhonemesArray.forEach(obj => {
            const key = Object.keys(obj)[0];
            if (!existingKeys.has(key)) {
                setWordPhonemesArray(prevState => [...prevState, key]);
                existingKeys.add(key); // Update the Set with the new key
            }
        });
    
        console.log("wordPhonemesArray:", wordPhonemesArray);
    };


    // adding all the mispronounciation data to the 
    const addMispronounsWordsData = () => {
        
        const totalMispronounciationIdxs = JsonResult.mispronunciations;

        // console.log("totalMispronounciationIdxs: ", totalMispronounciationIdxs);

        // Update mispronounsWords state by adding elements from totalMispronounciationIdxs
        totalMispronounciationIdxs.forEach(idx => {
            if(!mispronounsWords.includes(idx)){
                setMispronounsWords(prevState => [...prevState, Number(idx)]);
            }
        });
    }

    // adding all the Omission data to the 
    const addOmissionWordsData = () => {
        const totalOmissionsIdxs = JsonResult.omissions;
        // Update mispronounsWords state by adding elements from totalMispronounciationIdxs
        totalOmissionsIdxs.forEach(idx => {
            if(!omissionsWords.includes(idx)){
                setOmissionsWords(prevState => [...prevState, Number(idx)]);
            }
        });
    }

    // adding all the Omission data to the 
    const addInsertionsData = () => {
        const totalInsertionsIdxs = JsonResult.insertions;
        // Update mispronounsWords state by adding elements from totalMispronounciationIdxs
        totalInsertionsIdxs.forEach(idx => {
            if(!insertionWords.includes(idx)){
                setInsertionWords(prevState => [...prevState, Number(idx)]);
            }
        });
    }

    // adding all the Omission data to the 
    const addUnexpectedBreakData = () => {
        const totalunexpectedBreaksIdxs = JsonResult.unexpectedBreaks;
        // Update mispronounsWords state by adding elements from totalMispronounciationIdxs
        totalunexpectedBreaksIdxs.forEach(idx => {
            if(!unexpectedBreakWords.includes(idx)){
                setUnexpectedBreakWords(prevState => [...prevState, Number(idx)]);
            }
        });
    }

    // adding all the Missing Breaks Words data to the 
    const addMissingBreaksData = () => {
        const totalmissingBreaks = JsonResult.missingBreaks;
        // Update mispronounsWords state by adding elements from totalMispronounciationIdxs
        totalmissingBreaks.forEach(idx => {
            if(!missingBreaksWords.includes(idx)){
                setMissingBreaksWords(prevState => [...prevState, Number(idx)]);
            }
        });
    }

    // adding all the Missing Breaks Words data to the 
    const addMonotoneData = () => {
        const totalMonotonesWords = JsonResult.monotones;
        // Update mispronounsWords state by adding elements from totalMispronounciationIdxs
        totalMonotonesWords.forEach(idx => {
            if(!monotonWords.includes(idx)){
                setMonotonWords(prevState => [...prevState, Number(idx)]);
            }
        });
    }
        
    const handleMispronounsClick = () => {
        let mispronounciation = document.getElementById('mispronounciation_input').checked;
        addMispronounsWordsData();
        addWordPhonemesArray();
        setIsMispronounsEnabled(mispronounciation);
    }
    
    const handleOmissionClick = () => {
        let omissions = document.getElementById('omissions_input').checked;
        addOmissionWordsData();
        setIsOmmisionEnabled(omissions);
    }

    const handleInsertionClick = () => {
        let monoton = document.getElementById('insertion_input').checked;
        addInsertionsData();
        setIsInsertionEnabled(monoton);
    }

    const handleMissingBreakClick = () => {
        let missing_break = document.getElementById('missing_break_input').checked;
        addMissingBreaksData();
        setIsMissingBreakEnabled(missing_break);
    }
    
    const handleUnexpectedBreakInputBreakClick = () => {
        let unexpected_break = document.getElementById('unexpected_break_input').checked;
        addUnexpectedBreakData();
        setIsUnexpectedBreakEnabled(unexpected_break);
    }
    
    const handleMonotoneClick = () => {
        let monoton = document.getElementById('monoton_input').checked;
        addMonotoneData();
        setIsMonotonInputEnabled(monoton);
    }


   return (
       <> 
        {userRole === 1 && <NavBar />} 
        
                            


        {( JsonResult ? 

           <div className='py-10 md:py-0 mt-6 md:mt-16'>
            <div className="flex lg:mt-0  justify-center w-screen ">

               

{/* LEFT OF THE PAGE */}
<div className="flex-none text-gray-900"> 
            
</div>


{/* CENTER OF THE PAGE */}
<div className=" flex-none lg:w-3/5 md:w-full  w-screen   text-gray-900">


    <div className="flex items justify-center">
        <div className="lg:m-10 m-10 w-full ">  

            {/* MAIN CENTER PART  */}


            <div className=" flex flex-item lg:flex-nowrap flex-wrap justify-between">
         
             {
                 /*  ==============================================================================
                     ========================== TEXT-RESULT CARD ==================================
                     ============================================================================== */
             }
                <div className=" p-6 lg:m-0 m-3 bg-white border border-gray-300 rounded-lg shadow ">
                     
                     {   
                         JsonResult.totalPhrase.map((item, index) => (  
                             <>
                                 <span className = {`${(isUnexpectedBreakEnabled && unexpectedBreakWords.includes(index) ? "unexpected_break_word": null)} `} > </span>
                                 <span className = {`${(isMissingBreakEnabled && missingBreaksWords.includes(index) ? "missing_break_word": null)}`} > </span>
                                 
                                 <span 
                                     className = {`word text-xl text-justify
                                                     ${(isMispronounsEnabled && mispronounsWords.includes(index) ? "mispronounsed_word": null)}
                                                     ${(isOmmisionEnabled && omissionsWords.includes(index) ? "omission_word": null)}
                                                     ${(isInsertionEnabled && insertionWords.includes(index) ? "insertions_word": null)}
                                                     ${(isMonotonInputEnabled && monotonWords.includes(index) ? "monoton_word": null)}
                                                 `}
                                     key={`${index}`}>

                                    {(
                                        isMispronounsEnabled && mispronounsWords.includes(index) &&
                                        // <ContextPopupCard data={JSON.stringify(} />   
                                        <ContextPopupCard 
                                                JsonResult={JsonResult}
                                                idx={index}
                                        />   
                                    )}

                                     {Object.values(item)[0]}
                                 </span>
                             </>
                         ))
                     }

                </div>

                {/* FILTERS BLOCK  */}
                <div className="p-6 lg:m-0 m-3 bg-white border w-screen border-gray-200 rounded-lg shadow ">
                           
                         <div className='text-2xl text-second'>{isReadingResult ? "Reading":"Speaking"} Errors</div>
                         <br className='m-0 p-0' />

                         <FilterToggle  
                             name="Mispronunciation" 
                             onClick={handleMispronounsClick}  
                             id = "mispronounciation_input"
                             noOfError={JsonResult.mispronunciations.length}
                             errCountClassName="bg-yellow-500" />
                         <hr className='m-2' />

                         { isReadingResult ? 
                             <>
                                 <FilterToggle  
                                     name="Omissions" 
                                     onClick={handleOmissionClick}  
                                     id = "omissions_input" 
                                     noOfError={JsonResult.omissions.length}
                                     errCountClassName="bg-gray-300" />
                                 <hr className='m-2' />
                             </> : null
                         }


                         { isReadingResult ? 
                             <>
                                 <FilterToggle  
                                         name="Insertion" 
                                         onClick={handleInsertionClick}  
                                         id = "insertion_input" 
                                         noOfError={JsonResult.insertions.length}
                                         errCountClassName="bg-red-500 text-white" />
                                 <hr className='m-2' />
                             </> : null
                         }
                         
                         { !isReadingResult ? 
                             <>
                                 <FilterToggle  
                                         name="Unexpected break" 
                                         onClick={handleUnexpectedBreakInputBreakClick}  
                                         noOfError={JsonResult.unexpectedBreaks.length}
                                         id = "unexpected_break_input" 
                                         errCountClassName="bg-red-400 text-white"/>
                                 <hr className='m-2' />
                             </> : null
                         }
                         
                         { !isReadingResult ? 
                             <>
                                 <FilterToggle 
                                         name="Missing Break" 
                                         onClick={handleMissingBreakClick}  
                                         id = "missing_break_input"
                                         noOfError={JsonResult.missingBreaks.length}/>
                                 <hr className='m-2' />
                             </> : null
                         }

                         
                         { !isReadingResult ? 
                             <>
                                 <FilterToggle  name="Monotone" 
                                     onClick={handleMonotoneClick}  
                                     id = "monoton_input" 
                                     noOfError={JsonResult.monotones.length}
                                     errCountClassName="bg-purple-600 text-white"/>
                                 <hr className='m-2' />
                             </> : null
                         }

                </div>
                   
            </div>




            {/* STATICS */}
            <div className="lg:mx-0 mx-3 mt-3 p-6 bg-white border border-gray-200 rounded-lg shadow ">

                <div className="h-full flex flex-item flex-wrap">

                    <div className='lg:w-1/4 lg:mb-0 mb-10 w-full '>
                        <p className='pb-2 text-center'>Pronunciation: </p>
                        <DoughtnutComponent  
                        percentage={pronScore}/>
                    </div>

                     
                    <div className="lg:w-3/4 w-full grid grid-rows-2 grid-flow-col gap-2 items-center">
                         {accuracyScore ? <ProgressBar percentage={accuracyScore}  name="Accuracy Score"/> : null}
                         {fluencyScore ? <ProgressBar  percentage={fluencyScore} name="Fluency Score" />: null}
                         {completenessScore  ? <ProgressBar percentage={completenessScore} name="Completness Score" />:null}
                    </div>

                </div>
            </div>

            {/* STATICS */}
            {!isReadingResult ?  
            <div className="lg:mx-0 mx-3 mt-3 p-6 bg-white border border-gray-200 rounded-lg shadow ">

                     <div className="h-full flex flex-item flex-wrap">

                     <div className='lg:w-1/4 lg:mb-0 mb-10 w-full '>
                        <p className='p-2 text-center'>Content Score: </p>
                        <DoughtnutComponent  
                             percentage={contentScore}
                         />
                    </div>

                    <div className="lg:w-3/4 w-full grid grid-rows-2 grid-flow-col gap-2 items-center">
                         {vocabularyScore !== null ? <ProgressBar percentage={vocabularyScore}  name="Vocabulary Score"/> : null}
                         {grammarScore !== null ? <ProgressBar  percentage={grammarScore} name="Grammar Score" />: null}
                         {topicScore !== null ? <ProgressBar percentage={topicScore} name="Topic Score" />:null}
                    </div>
                    
                </div>
            </div> : null}



        </div>     
    </div> 

            <Link to={`/?subjectId=${subjectId}&category=${isReadingResult ? 'Reading': 'Speaking'}`} 
                className="lg:mb-4 lg:mr-4 mb-4 mr-4 p-3 fixed right-0 bottom-0 bg-white hover:bg-gray-100 text-gray-800 font-semibold  border border-gray-400 rounded shadow">
                Next Question
            </Link> 
            
</div>


{/* RIGHT OF THE PAGE */}
<div className="flex-none bg-gray-50 text-gray-900">
</div>

<div></div>


<div></div>

</div>
           </div>

           : <LoadingScreenLarge /> )}



       </>
   )
}




// Function to c    eck if the key exists
function checkKeyExists(obj, key) {

    const path = key.split('.');
    let currentObj = obj;

    for (const prop of path) {
        if (!currentObj || typeof currentObj !== 'object' || !(prop in currentObj)) {
            return 0;
        }
        currentObj = currentObj[prop];
    }

    return 1;
}


export default FeedbackPage