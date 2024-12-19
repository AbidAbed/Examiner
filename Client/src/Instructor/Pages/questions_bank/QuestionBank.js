import { useEffect, useRef, useState } from "react";
import "./question_bank.css"
function QuestionBank() {
    const [questions, setQuestions] = useState([{
        type: "multiple-choice-single-answer",
        points: 1,
        text: "tetstse",
        isTestBank: false,
        isAiGenerated: false,
        answers: [
            { text: "True", isCorrect: true },
            { text: "false", isCorrect: false }
        ]
    }])

    const [isLoading, setIsLoading] = useState(false);
    const observer = useRef(null);
    const loadingRef = useRef(null);

    const loadMoreItems = () => {
        setIsLoading(true);
        console.log();
        
        setTimeout(() => {
            setQuestions([...questions, ...questions])
            setIsLoading(false);
        }, 1500);
    };

    useEffect(() => {
        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    loadMoreItems();
                }
            },
            { threshold: 1.0 }
        );
        if (loadingRef.current) {
            observer.current.observe(loadingRef.current);
        }
        return () => observer.current && observer.current.disconnect();
    }, [isLoading]);

    function editQuestionSetup(e, question, index) {

    }

    function deleteQuestion(e, question, index) {

    }

    function addQuestion() {

    }
    return <div className="main_page_content">

        <div className="container">
            <div className="page-navigation" style={{ display: 'flex', flexDirection: 'row', padding: '4px', alignItems: 'center' }}>
                <button className="add-answer-btn" style={{ display: 'flex' }} onClick={addQuestion}>Add question</button>
            </div>
            <div
                style={{
                    height: "400px",
                    overflow: "auto",
                    border: "1px solid #ccc",
                    padding: "10px",
                }}
            >
                {questions.map((question, index) => {
                    switch (question.type) {
                        case "multiple-choice-single-answer":
                            return <div key={question.type + "-" + index} draggableId={question.type + "-" + index} index={index} >
                                <div className="question mcq" >
                                    <div className="question_content">
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <span>{index + 1}{") "}{question.text}</span>
                                            <span className="points">{question.points} Point</span>
                                        </div>
                                        <span className="edit_delete">
                                            <button className="edit_button" onClick={(e) => editQuestionSetup(e, question, index)}>⚙️</button>
                                            <button className="delete_button" onClick={(e) => deleteQuestion(e, question, index)}>❌</button>
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        {question.answers.map((answer) =>
                                            <label style={{ backgroundColor: answer.isCorrect ? 'green' : 'red ' }}>
                                                <input type="radio" disabled={true} name={answer.text} value={answer.text} />{answer.text}</label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        case "true/false":
                            return <div key={question.type + "-" + index} draggableId={question.type + "-" + index} index={index} >
                                <div className="question true_false" >
                                    <div className="question_content">
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <span>{index + 1}{") "}{question.text}</span>
                                            <span className="points">{question.points} Point</span>
                                        </div>
                                        <span className="edit_delete">
                                            <button className="edit_button" onClick={(e) => editQuestionSetup(e, question, index)}>⚙️</button>
                                            <button className="delete_button" onClick={(e) => deleteQuestion(e, question, index)}>❌</button>
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        {question.answers.map((answer) =>
                                            <label style={{ backgroundColor: answer.isCorrect ? 'green' : 'red ' }}>
                                                <input disabled={true} type="radio" name={answer.text} value={answer.text} />{answer.text}</label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        case "short-answer":
                            return <div key={question.type + "-" + index} draggableId={question.type + "-" + index} index={index} >
                                <div className="question short_answer">
                                    <div className="question_content">
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <span>{index + 1}{") "}{question.text}</span>
                                            <span className="points">{question.points} Point</span>
                                        </div>
                                        <span className="edit_delete">
                                            <button className="edit_button" onClick={(e) => editQuestionSetup(e, question, index)}>⚙️</button>
                                            <button className="delete_button" onClick={(e) => deleteQuestion(e, question, index)}>❌</button>
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        {question.answers.map((answer) =>
                                            <label><textarea disabled={true} type="text" name="shAn" value="" placeholder={answer.text} /></label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        case "multiple-choice-multiple-answer":
                            return <div key={question.type + "-" + index} draggableId={question.type + "-" + index} index={index} >

                                <div className="question checkbox">
                                    <div className="question_content">
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <span>{index + 1}{") "}{question.text}</span>
                                            <span className="points">{question.points} Point</span>
                                        </div>
                                        <span className="edit_delete">
                                            <button className="edit_button" onClick={(e) => editQuestionSetup(e, question, index)}>⚙️</button>
                                            <button className="delete_button" onClick={(e) => deleteQuestion(e, question, index)}>❌</button>
                                        </span>
                                    </div>


                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        {question.answers.map((answer) =>
                                            <div style={{ backgroundColor: answer.isCorrect ? 'green' : 'red ', padding: '3px' }}>
                                                <input disabled={true} type="checkbox" name={answer.text} value={answer.text} />
                                                <label style={{ paddingLeft: '4px' }}>{answer.text}</label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                    }
                })}
            </div>
        </div>

    </div>
}
export default QuestionBank