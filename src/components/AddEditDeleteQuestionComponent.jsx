import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import LoadingScreenLarge from './LodingScreenLarge';

const cookies = new Cookies();

function AddNewQuestionComponent() {

  const accesstoken = cookies.get("access_token");

  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectName, setSelectedSubjectName] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [isSubjectLoading, setIsSubjectLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [showUpdateInput, setShowUpdateInput] = useState(false);

const BASE_URL  = "http://localhost:5000";

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchQuestions(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    setIsSubjectLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/v1/fetch-all-subjects`, {
        headers: {
          'Authorization': 'Bearer ' + accesstoken
        }
      });
      const data = await response.json();
      if (response.ok){
      setSubjects(data.data.result);
      }
      else{
        if (data.status_code === 498 || data.status_code === 440) {
          cookies.remove('access_token', { path: '/' });
          cookies.remove('user_role', { path: '/' });
          window.location.reload();
      }
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setIsSubjectLoading(false);
    }
  };

  const fetchQuestions = async (subjectId) => {
    setIsQuestionLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/v1/get-all-questions?subjectId=${subjectId}`, {
        headers: {
          'Authorization': 'Bearer ' + accesstoken
        }
      });
      const data = await response.json();
      if (response.ok){
      setQuestions(data.data.result.questions);
      }
      else{
        if (data.status_code === 498 || data.status_code === 440) {
          cookies.remove('access_token', { path: '/' });
          cookies.remove('user_role', { path: '/' });
          window.location.reload();
      }
    }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsQuestionLoading(false);
    }
  };

  const handleSubjectChange = (e) => {
    const selectedSubjectId = e.target.value;
    setSelectedSubject(selectedSubjectId);
  
    // Find the selected subject from the list to set its name
    const subject = subjects.find(sub => sub.subjectId === selectedSubjectId);
    setSelectedSubjectName(subject ? subject.subject_name : '');
    
    setSelectedQuestion('');
    setQuestionTitle('');
    setQuestionType('');
    setNewSubjectName(''); // Reset new subject name input
  };
  
  const handleQuestionChange = (e) => {
    const question = questions.find(q => q.questionId === e.target.value);
    setSelectedQuestion(e.target.value);
    setQuestionTitle(question ? question.question.body : '');
    setQuestionType(question ? question.question.type : '');
  };

  const handleNewSubjectNameChange = (e) => {
    setNewSubjectName(e.target.value);
  };

  const handleQuestionTitleChange = (e) => {
    setQuestionTitle(e.target.value);
  };
  
  const handleSubjectNameChange = (e) => {
    setSelectedSubjectName(e.target.value);
  };

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
  };
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    } else {
      return text;
    }
  };

  const handleShowUpdateInputButton = () => {
      setShowUpdateInput(!showUpdateInput)
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSubject && newSubjectName) {
      // Create a new subject and associated question
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/v1/create-subject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accesstoken
          },
          body: JSON.stringify({
            subject_name: newSubjectName,
            body: questionTitle,
            type: questionType
          })
        });

        setIsLoading(false);

        const data = await response.json();
        fetchSubjects(); // Refresh subjects list
        setSelectedSubject(selectedSubjectName); // Select new subject
        setNewSubjectName(''); // Clear new subject input
        setQuestionTitle(''); // Clear question title
        setQuestionType(''); // Clear question Type
      } catch (error) {
        console.error('Error creating new subject:', error);
      }
    } else if (selectedSubject && !selectedQuestion) {
      // Create a new question for the selected subject
      try {
        setIsLoading(true);

        await fetch(`${BASE_URL}/v1/create-question`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accesstoken
          },
          body: JSON.stringify({
            subjectId: selectedSubject,
            body: questionTitle,
            type: questionType
          })
        });

        setIsLoading(false);

        fetchQuestions(selectedSubject); // Refresh questions list
        setQuestionTitle(''); // Clear question title
        setQuestionType(''); // Clear question Type
      } catch (error) {
        console.error('Error creating new question:', error);
      }
    } else if (selectedQuestion) {
      // Update an existing question
      try {

        setIsLoading(true);
        await fetch(`${BASE_URL}/v1/edit-question?questionId=${selectedQuestion}&questionBody=${questionTitle}&type=${questionType}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accesstoken
          }
        });

        setIsLoading(false);
        fetchQuestions(selectedSubject); // Refresh questions list
        setSelectedQuestion(''); // Deselect question
        setQuestionTitle(''); // Clear question title
        setQuestionType(''); // Clear question Type
      } catch (error) {
        console.error('Error updating question:', error);
      }
    }
  };

  const handleDeleteSubject = async () => {
    if (!selectedSubject) return;

    try {
      await fetch(`${BASE_URL}/v1/delete-subject?subjectId=${selectedSubject}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + accesstoken
        },
      });
      fetchSubjects(); // Refresh subjects list
      setSelectedSubject(''); // Deselect subject
      setSelectedQuestion(''); // Deselect question
      setQuestions([]); // Clear questions list
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return;

    try {
      await fetch(`${BASE_URL}/v1/delete-question?questionId=${selectedQuestion}&subjectId=${selectedSubject}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + accesstoken
        }
      });
      fetchQuestions(selectedSubject); // Refresh questions list
      setSelectedQuestion(''); // Deselect question
      setQuestionTitle(''); // Clear question title
      setQuestionType(''); // Clear question Type
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleUpdateSubjectName = async () => {
    if (!selectedSubject || !selectedSubjectName) return;
    try {
      await fetch(`${BASE_URL}/v1/edit-subject?subjectId=${selectedSubject}&subject_name=${selectedSubjectName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accesstoken
        }
      });
      fetchSubjects(); // Refresh subjects list
    } catch (error) {
      console.error('Error updating subject name:', error);
    }
  };
  


  return (
    <div className="flex justify-center items-center">
      <form className="w-full mx-10 max-w-lg" onSubmit={handleSubmit}>

        {/* EMPTY */} <div className='mt-20'></div>

        <div className="lg:text-3xl text-2xl pt-12 pb-8 text-center  border-b mb-5">Create or Update <span className='text-red-400'>Question</span> </div>
        <div className="mb-0 ">

          <div className='w-full'>
              <label htmlFor="subject-select" className="block mb-2 text-sm font-medium text-gray-900 ">
                Select Subject:
              </label>
              {isSubjectLoading ? (
                <div>Loading...</div>
              ) : (

                <div className=' flex items-center justify-between'>
                    <select
                      id="subject-select"
                      value={selectedSubject}
                      onChange={handleSubjectChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject.subjectId} value={subject.subjectId}>
                          {subject.subject_name}
                        </option>
                      ))}
                    </select>
                </div>
              )}
          </div>

        </div>

        {selectedSubject && (
            <div className='w-full mt-1 flex justify-end text-right'>
              <div className='flex'>

                  <button
                      type="button"
                      onClick={handleShowUpdateInputButton}
                      className='text-blue-600 ml-2'>
                      edit 
                    </button>
                  <button
                      type="button"
                      onClick={handleDeleteSubject}
                      className='text-red-600 underline ml-2'>
                      delete
                    </button>
                </div>
            </div>
        )}


        {selectedSubject && showUpdateInput && (
          <div className="mb-4">
            <label htmlFor="update-subject-name" className="block mb-2 text-sm font-medium text-gray-900">
              Update Subject Name:
            </label>
            <div className="flex">
              <input
                type="text"
                  id="update-subject-name"
                  value={selectedSubjectName}
                  onChange={handleSubjectNameChange}
                  className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                  placeholder="New Subject Name"
              />
              <button
                  type="button"
                  onClick={handleUpdateSubjectName}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-r-lg hover:bg-blue-800"
                >
                UPDATE 
              </button>
            </div>
          </div>
        )}


        {!selectedSubject && (
          <div className="mb-4">
            <label htmlFor="new-subject-name" className="block mt-10 mb-2 text-sm font-medium text-gray-500">
              Create New Subject:
            </label>
            <input
              type="text"
              id="new-subject-name"
              value={newSubjectName}
              onChange={handleNewSubjectNameChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="New Subject Name"
            />
            <p className='text-sm pt-1 pb-3 text-end text-red-300'>*You can't use a name that's already taken</p>
          </div>
          
        )}


        {selectedSubject && (
          <div className="mb-1">
            <label htmlFor="question-select" className="block mb-2 text-sm font-medium text-gray-500">
              Select Question:
            </label>
            {isQuestionLoading ? (
              <div>Loading...</div>
            ) : (
              <select
                id="question-select"
                value={selectedQuestion}
                onChange={handleQuestionChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              >
                <option value="">Select Question</option>
                {questions.map((question) => (
                  <option key={question.questionId} value={question.questionId} title={question.question.body}>
                    {truncateText(question.question.body, 50)} {/* Truncate title to 50 characters */}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}


        {selectedQuestion && (
            <div className='w-full flex justify-end text-right'>
              <div className='flex'>
                  <button
                      type="button"
                      onClick={handleDeleteQuestion}
                      className='text-red-600 ml-2 '>
                      delete question
                    </button>
                </div>
            </div>
        )}

<div className="w-full px  py-2  rounded-t-lg">
            
              
                
            <h3 className="mb-2 font- text-gray-900 ">Choose Question Type</h3>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex " >
              <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                <div className="flex items-center ps-3">
                  <input
                    id="horizontal-list-radio-reading"
                    type="radio"
                    value="Reading"
                    checked={questionType === 'Reading'}
                    onChange={(!selectedQuestion ?  handleQuestionTypeChange : null) }
                    name="questionType"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                  />
                  <label
                    htmlFor="horizontal-list-radio-reading"
                    className="w-full py-3 ms-2 text-sm font-medium text-black "
                  >
                    Reading
                  </label>
                </div>
              </li>
              <li className="w-full ">
                <div className="flex items-center ps-3">
                  <input
                    id="horizontal-list-radio-speaking"
                    type="radio"
                    value="Speaking"
                    checked={questionType === 'Speaking'}
                    onChange={(!selectedQuestion ?  handleQuestionTypeChange : null) }
                    name="questionType"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                  />
                  <label
                    htmlFor="horizontal-list-radio-speaking"
                    className="w-full py-3 ms-2 text-sm font-medium text-black "
                  >
                    Speaking
                  </label>
                </div>
              </li>
            </ul>
            
            {(selectedQuestion && <p className='text-sm pt-1 pb-3 text-end text-red-300'>*question type can't change</p>)}
          </div>


        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 ">
          <div className="w-full px-4 py-2 bg-white rounded-t-lg ">
            <label htmlFor="post_question" className="sr-only">Question Title</label>
            <textarea
              id="post_question"
              rows="6"
              value={questionTitle}
              onChange={handleQuestionTitleChange}
              className="w-full focus:outline-none px-0 lg:text-xl text-gray-900 bg-white border-0 "
              placeholder="Write your Question Title..."
              required
            ></textarea>
          </div>
        </div>

        <div className="w-full border-gray-200 rounded-lg ">
          
          <div className="flex items-center justify-between ">
            <button
              type="submit"
              className="inline-flex items-center py-3 px-4 text-sm font-medium  text-center text-white bg-primary rounded-lg hover:bg-red-800"
            >
              {selectedQuestion ? 'UPDATE QUESTION' : 'POST QUESTION'}
            </button>
          </div>
        </div>


        {selectedSubject && (
          <div className="mb-4">
            
          </div>
        )}
      </form>

      {(isLoading && < LoadingScreenLarge/>)}
    </div>
  );
}

export default AddNewQuestionComponent;