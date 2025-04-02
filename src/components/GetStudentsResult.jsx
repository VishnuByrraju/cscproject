import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import LoadingScreenLarge from '../components/LodingScreenLarge';
import NavBar from '../components/NavBar';
import CardQuestionComponent from '../components/CardQuestionComponent';

const cookies = new Cookies();
const BASE_URL = "http://localhost:5000";

function GetResultsPage() {
  const accesstoken = cookies.get("access_token");
  const userRole = cookies.get("user_role");
  const userId = cookies.get("userId");
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');

  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [isSubjectLoading, setIsSubjectLoading] = useState(false);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);

  useEffect(() => {
    if (userRole === 0) {
      fetchStudents();
    } else {
      fetchSubjects();
    }
  }, [userRole]);

  useEffect(() => {
    if (selectedStudent) {
      fetchSubjects();
    }
  }, [selectedStudent]); // Trigger fetchSubjects whenever selectedStudent changes

  const fetchStudents = async () => {
    try {
      setIsStudentLoading(true);
      const response = await fetch(`${BASE_URL}/v1/get-students`, {
        headers: {
          'Authorization': 'Bearer ' + accesstoken
        }
      });
      const data = await response.json();
      setStudents(data.data.result);
      setIsStudentLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setIsStudentLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setIsSubjectLoading(true);
      const response = await fetch(`https://55cr1n59r3.execute-api.us-east-2.amazonaws.com/dev/v1/subjects/fetch-my-finished-subjects?userId=${userId}`, {
        headers: {
          'Authorization': 'Bearer ' + accesstoken
        }
      });
      const data = await response.json();
      console.log("Subjects data:", data);
      setSubjects(data.finished_subjects);
      setIsSubjectLoading(false);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setIsSubjectLoading(false);
    }
  };

  const getQuestions = async (selectedSubject) => {
    if (selectedSubject) {
      try {
        setIsQuestionLoading(true);
        const response = await fetch(`https://55cr1n59r3.execute-api.us-east-2.amazonaws.com/dev/v1/subjects/get-my-finished-questions?subjectId=${selectedSubject}&userId=${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accesstoken
          }
        });
        const res = await response.json();
        console.log("Questions data:", res);
        if (response.ok) {
        setQuestions(res.finishedQuestions.map(questionData => ({
          body: questionData.body,
          questionId: questionData.questionId,
          type: questionData.type,
          subjectId: questionData.subjectId,
        })));
        setIsQuestionLoading(false);
      }
      else{
        if (res.status_code === 498 || res.status_code === 440) {
          cookies.remove('access_token', { path: '/' });
          cookies.remove('user_role', { path: '/' });
          window.location.reload();
      }
      }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setIsQuestionLoading(false);
      }
    }
  };

  const handleStudentSelectChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    setSelectedSubject('');
    setSelectedQuestion('');
    // No need to call fetchSubjects here; useEffect will handle it
  };

  const readingQuestions = questions.filter(q => q.type === 'Reading');
  const speakingQuestions = questions.filter(q => q.type === 'Speaking');

  return (
    <>
      <div className="flex items-start justify-start min-h-screen bg-gray-100 p-5">
        <div className="max-w-screen-lg mx-auto">

          <div className="mt-10 mb-5">
            <h1 className="text-3xl font-semibold text-center pt-5">Get Results</h1>
          </div>

          <div className="mb-5">
            <div className="dropdown-container">

              <div className="flex flex-wrap justify-center mb-3">

                {userRole === 0 && (
                  <div className="dropdown mr-3 mb-3">
                    {isStudentLoading ? (
                      <LoadingScreenLarge />
                    ) : (
                      <select
                        id="student-select"
                        value={selectedStudent}
                        onChange={handleStudentSelectChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option value="">Select Student</option>
                        {students.map(student => (
                          <option key={student.userId} value={student.userId}>
                            {student.first_name + " " + student.last_name + " - " + student.email}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div className="dropdown ml-3 mb-3 w-1/2">
                  {isSubjectLoading ? (
                    <LoadingScreenLarge />
                  ) : (
                    <select
                      id="subject-select"
                      value={selectedSubject}
                      onChange={(e) => {
                        setSelectedSubject(e.target.value);
                        getQuestions(e.target.value);
                      }}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject.subjectId} value={subject.subjectId}>
                          {subject.subject_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

              </div>

            </div>
          </div>

          {isQuestionLoading ? (
            <LoadingScreenLarge />
          ) : selectedSubject && (
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-1/2 mb-5 lg:mb-0 lg:pr-2">
                <h2 className="text-lg mb-3 font-semibold text-center">Reading Questions</h2>
                <div className="grid gap-4">
                  {readingQuestions.map(question => (
                    <CardQuestionComponent
                      key={question.questionId}
                      cardDescription={question.body}
                      cardTitle={question.type}
                      to={`/feedback?subjectId=${question.subjectId}&questionId=${question.questionId}&studentId=${selectedStudent}`}
                    />
                  ))}
                </div>
              </div>
              
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default GetResultsPage;
