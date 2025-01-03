import { Link, useParams, useSearchParams } from "react-router"
import "./exam_details.css"
import { updateExam, useLazyGetExamTakerStatisticsQuery } from "../../../GlobalStore/GlobalStore"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"

function ExamDetails() {
  const { examId, roomId } = useParams()
  const dispatch = useDispatch()
  const config = useSelector((state) => state.config)

  const [exam, setExam] = useState()
  const [selectedPage, setSelectedPage] = useState(1)
  const [pages, setPages] = useState()

  const [getExamTakerStatistics, getExamTakerStatisticsResponse] = useLazyGetExamTakerStatisticsQuery()
  const [isFullReview, setIsFullReview] = useState(false)

  console.log(pages);

  useEffect(() => {
    if (!getExamTakerStatisticsResponse.isLoading && !getExamTakerStatisticsResponse.isUninitialized) {
      if (getExamTakerStatisticsResponse.isError) {
        toast.error("Error loading review")
      } else {
        setExam(getExamTakerStatisticsResponse.data)
        if (getExamTakerStatisticsResponse.data.exam.allowReview) {
          const pagesReconstructed = getExamTakerStatisticsResponse.data.exam.question.reduce((prevQuestion, curQuestion) => {
            console.log(curQuestion);

            if (prevQuestion[curQuestion.page])
              prevQuestion[curQuestion.page] = [...prevQuestion[curQuestion.page],
              {
                ...curQuestion,
                choosenAnswer: curQuestion.choosenAnswer ? curQuestion.choosenAnswer : "WAS NOT ANSWERED"
              }].sort((a, b) => a.order - b.order)
            else
              prevQuestion[curQuestion.page] = [{
                ...curQuestion,
                choosenAnswer: curQuestion.choosenAnswer ? curQuestion.choosenAnswer : "WAS NOT ANSWERED"
              }].sort((a, b) => a.order - b.order)

            return prevQuestion
          }, {})

          setPages(pagesReconstructed)
        }
      }
    }
  }, [getExamTakerStatisticsResponse])

  useEffect(() => {
    getExamTakerStatistics({
      token: config.token, params: {
        examId: examId,
        roomId: roomId
      }
    })
  }, [])


  return <div className="exam-details-main">
    {isFullReview ? <div id="questionsReview" className="tab-pane">

      <div className="breadcrumb">
        <Link to="/student/exams-review">Exam Review </Link>&nbsp; <Link onClick={(e) => setIsFullReview(false)}>/ Exam Details </Link>
        &nbsp; /  Full Review
      </div>
      <div className="custom-review-tab-container">

        <div id="manual_generator" className="generator" style={{ display: 'block' }}>

          <div className="custom-review-tab-bar">
            <ul>

              {Object.keys(pages).map((page, index) => <li key={index}
                className={`custom-review-tab-link ${selectedPage !== null && selectedPage === Number(page) ? "active" : ""}`}
                onClick={() => setSelectedPage(Number(page))}>Page {page}</li>)}
            </ul>
          </div>

          <div className="custom-review-tab-content-container">

            <div key={`questions-page-${selectedPage}`} className="custom-review-page-content active">
              <div>
                {pages[selectedPage].map((question, index) => {
                  switch (question.type) {
                    case "multiple-choice-single-answer":
                      return <div key={question.type + "-" + question._id}>
                        <div className="question mcq" >
                          <div className="question_content">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                              <span>{question.order}{") "}{question.text}</span>
                              <span className="points">{question.points} Point</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {question.answers.map((answer) =>
                              <label style={{ backgroundColor: answer.isCorrect ? 'green' : 'red ' }}>
                                <input type="radio" disabled={true} name={answer.text} value={answer.text} />{answer.text}</label>
                            )}
                            <label style={{ backgroundColor: 'orange' }}>
                              <label type="radio" disabled={true} name={question.choosenAnswer} value={question.choosenAnswer} />Your Answer : {question.choosenAnswer}</label>
                          </div>
                        </div>
                      </div>
                    case "true/false":
                      return <div key={question.type + "-" + question._id}>
                        <div className="question true_false">
                          <div className="question_content">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                              <span>{question.order}{") "}{question.text}</span>
                              <span className="points">{question.points} Point</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {question.answers.map((answer) =>
                              <label style={{ backgroundColor: answer.isCorrect ? 'green' : 'red ' }}>
                                <input disabled={true} type="radio" name={answer.text} value={answer.text} />{answer.text}</label>
                            )}
                            <label style={{ backgroundColor: 'orange' }}>
                              <label type="radio" disabled={true} name={question.choosenAnswer} value={question.choosenAnswer} />Your Answer : {question.choosenAnswer}</label>

                          </div>
                        </div>
                      </div>
                    case "short-answer":
                      return <div key={question.type + "-" + question._id}  >
                        <div className="question short_answer">
                          <div className="question_content">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                              <span>{question.order}{") "}{question.text}</span>
                              <span className="points">{question.points} Point</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {question.answers.map((answer) =>
                              <label><textarea disabled={true} type="text" name="shAn" value="" placeholder={answer.text} /></label>
                            )}
                            <label style={{ backgroundColor: 'orange' }}>
                              <label type="radio" disabled={true} name={question.choosenAnswer} value={question.choosenAnswer} />Your Answer : {question.choosenAnswer}</label>

                          </div>
                        </div>
                      </div>
                    case "multiple-choice-multiple-answer":
                      return <div key={question.type + "-" + question._id}  >
                        <div className="question checkbox">
                          <div className="question_content">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                              <span>{question.order}{") "}{question.text}</span>
                              <span className="points">{question.points} Point</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {question.answers.map((answer) =>
                              <div style={{ backgroundColor: answer.isCorrect ? 'green' : 'red ', padding: '3px' }}>
                                <input disabled={true} type="checkbox" name={answer.text} value={answer.text} />
                                <label style={{ paddingLeft: '4px' }}>{answer.text}</label>
                              </div>
                            )}
                            <label style={{ backgroundColor: 'orange' }}>
                              <label disabled={true} name={question.choosenAnswer} value={question.choosenAnswer.replace("-", ",")} />Your Answer : {question.choosenAnswer.replaceAll("-", ", ")}</label>

                          </div>
                        </div>
                      </div>
                  }
                })}
              </div>
            </div>
          </div>



          <div className="navigate_buttons">
            <button id="prevPage" className="custom-review-btn-prev"
              style={{ backgroundColor: selectedPage - 1 <= 0 ? "gray" : "" }}
              disabled={selectedPage - 1 <= 0}
              onClick={(e) => {
                e.preventDefault()
                setSelectedPage(selectedPage - 1)
              }}>Make Previous</button>
            <button id="nextPage" className="custom-review-btn-next"
              style={{ backgroundColor: selectedPage + 1 > exam.exam.numberOfPages ? "gray" : "" }}
              disabled={selectedPage + 1 > exam.exam.numberOfPages}
              onClick={(e) => {
                e.preventDefault()
                setSelectedPage(selectedPage + 1)
              }}>Make Next</button>
          </div>
        </div>

      </div >

    </div > : <>
      <div className="breadcrumb">
        <Link to="/student/exams-review">Exam Review</Link>&nbsp;/&nbsp;Exam Details
      </div>
      {!exam || exam === null ? <tr><td>Couldn't load review</td></tr> :
        <>
          <table className="exam-details-table"><tbody>
            <tr>
              <td><strong>Exam Name</strong></td>
              <td>{exam.exam.name}</td>
            </tr>
            <tr>
              <td><strong>Instructor Name</strong></td>
              <td>{exam.exam.instructor.user.username}</td>
            </tr>
            <tr>
              <td><strong>Instructor Email</strong></td>
              <td>{exam.exam.instructor.user.email}</td>
            </tr>
            <tr>
              <td><strong>Exam Date</strong></td>
              <td>{(new Date(exam.exam.scheduledTime)).toDateString()}</td>
            </tr>

            <tr>
              <td><strong>Exam Duration</strong></td>
              <td>{exam.exam.duration} minutes</td>
            </tr>


            <tr>
              <td><strong>Exam Start Date</strong></td>
              <td>{(new Date(exam.exam.scheduledTime)).toDateString()}{"   "}{(new Date(exam.exam.scheduledTime)).getHours()}:{(new Date(exam.exam.scheduledTime)).getMinutes()}</td>
            </tr>
            <tr>
              <td><strong>Exam End Date</strong></td>
              <td>{(new Date(exam.exam.scheduledTime + exam.exam.duration * 1000 * 60)).toDateString()}{"   "}{(new Date(exam.exam.scheduledTime + exam.exam.duration * 1000 * 60)).getHours()}:{(new Date(exam.exam.scheduledTime + exam.exam.duration * 1000 * 60)).getMinutes()}</td>
            </tr>

            {exam.exam.allowReview ? <><tr>
              <td><strong>Wrong answers:</strong></td>
              <td>{exam.exam.examTakerStatistics.wrongAnswers} / {exam.exam.numberOfQuestions}</td>
            </tr>
              <tr>
                <td><strong>Correct answers</strong></td>
                <td>{exam.exam.examTakerStatistics.correctAnswers} / {exam.exam.numberOfQuestions}</td>
              </tr>
              <tr>
                <td><strong>Exam Total Result</strong></td>
                <td style={{ color: "red" }}>{exam.exam.examTakerStatistics.score} / {exam.exam.fullScore}</td>
              </tr></> : exam.exam.showMark ? <><tr>
                <td><strong>Exam Total Result</strong></td>
                <td style={{ color: "red" }}>{exam.exam.examTakerStatistics.score} / {exam.exam.fullScore}</td>
              </tr></> : <>
              <tr>
                <td><strong>Not Available</strong></td>
              </tr>
            </>}

          </tbody>
          </table>
          <button className="button full_review"
            style={{ backgroundColor: exam.exam.allowReview ? "" : "gray" }}
            onClick={(e) => {
              e.preventDefault()
              setIsFullReview(true)
            }} disabled={!exam.exam.allowReview}>Full Review</button>
        </>
      }
    </>
    }

  </div >
}
export default ExamDetails