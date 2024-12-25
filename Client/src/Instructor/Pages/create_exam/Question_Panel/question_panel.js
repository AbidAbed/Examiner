import { useState } from "react"
import "./question_panel.css"
import QuestionPopup from "../../../Components/QuestionPopup/QuestionPopup"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TestBankImporter from "../../../Components/TestBankImporter/TestBankImporter";

function QuestionsPanel({ questions, setQuestions, setQuestionPanelShow }) {
    const [pages, setPages] = useState(questions.length === 0 ? [{ pageNumber: 1, questions: [] }] : questions)
    const [selectedPage, setSelectedPage] = useState(pages[0])
    const [isQuestionPopupVisable, setIsQuestionPopupVisable] = useState(false)
    const [editedQuestion, setEditedQuestion] = useState(null)
    const [isEditQuestionPopupVisable, setIsEditQuestionPopupVisable] = useState(false)
    const [isTestBankImporterVisable, setIsTestBankImporterVisable] = useState(false)

    function handleNewPage(e) {
        e.preventDefault()
        setPages([...pages, { pageNumber: pages.length + 1, questions: [] }])
    }

    function deletePage(e) {
        e.preventDefault()

        if (pages.length > 1) {
            if (selectedPage.pageNumber === pages[pages.length - 1].pageNumber)
                setSelectedPage(pages[0])
            setPages([...pages.slice(0, pages.length - 1)])
        }
    }

    function handleNextPage(e) {
        e.preventDefault()
        if (selectedPage.pageNumber + 1 <= pages.length)
            setSelectedPage(pages[selectedPage.pageNumber])
    }

    function handlePrevPage(e) {
        e.preventDefault()

        if (selectedPage.pageNumber - 1 > 0)
            setSelectedPage(pages[selectedPage.pageNumber - 2])
    }

    function handleAddQuestion(e, question) {
        e.preventDefault()
        console.log(question);

        setPages(pages.map((page, index) => {
            if (page.pageNumber === question.pageNumber) {
                if (selectedPage.pageNumber === question.pageNumber)
                    setSelectedPage({ ...page, questions: [...page.questions, question] })
                return { ...page, questions: [...page.questions, question] }
            }
            else
                return page
        }))
    }

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const sourceQuestion = selectedPage.questions[result.source.index]
        const destQuestion = selectedPage.questions[result.destination.index]

        const swappedQuestions = selectedPage.questions.map((question, index) => {
            if (index === result.source.index)
                return { ...destQuestion, order: index + 1 }
            else if (index === result.destination.index)
                return { ...sourceQuestion, order: index + 1 }
            else return question
        })

        setSelectedPage({ ...selectedPage, questions: swappedQuestions })
        setPages(pages.map((page) => {
            if (page.pageNumber === selectedPage.pageNumber)
                return { ...selectedPage, questions: swappedQuestions }
            else
                return page
        }))

    }

    function deleteQuestion(e, question, index) {
        e.preventDefault()
        const newQuestions = selectedPage.questions.filter((question, toDelInd) => toDelInd !== index)
        setSelectedPage({ ...selectedPage, questions: newQuestions })
        setPages(pages.map((page) => {
            if (page.pageNumber === selectedPage.pageNumber)
                return { ...selectedPage, questions: newQuestions }
            else
                return page
        }))
    }

    function handleEditQuestion(e, question) {
        e.preventDefault()
        const newQuestions = selectedPage.questions.map((existQuestion, index) => {
            if (index === question.order)
                return question
            else
                return existQuestion
        })

        setSelectedPage({ ...selectedPage, questions: newQuestions })

        setPages(pages.map((page) => {
            if (page.pageNumber === selectedPage.pageNumber)
                return { ...selectedPage, questions: newQuestions }
            else
                return page
        }))
    }

    function editQuestionSetup(e, question, index) {
        e.preventDefault()
        setEditedQuestion({ ...question, order: index })
        setIsEditQuestionPopupVisable(true)
    }

    function handleImportFromTestBank(questions) {
        const reconstructedQuestions = questions.map((question, index) => {
            return {
                _id: question._id,
                text: question.text,
                type: question.type,
                isTestBank: true,
                isAiGenerated: question.isAiGenerated,
                order: selectedPage.questions.length + index + 1,
                pageNumber: selectedPage.pageNumber,
                points: 1,
                answers: question.answers.map((answer) => { return { text: answer.text, isCorrect: answer.isCorrect } })
            }
        })

        setSelectedPage({ ...selectedPage, questions: [...questions, ...reconstructedQuestions] })

        setPages(pages.map((page, index) => {
            if (page.pageNumber === selectedPage.pageNumber) {
                if (selectedPage.pageNumber === selectedPage.pageNumber)
                    setSelectedPage({ ...page, questions: [...page.questions, ...reconstructedQuestions] })
                return { ...page, questions: [...page.questions, ...reconstructedQuestions] }
            }
            else
                return page
        }))
    }

    function handleSave(e) {
        e.preventDefault()
        setQuestions(pages)
        setQuestionPanelShow(false)
    }
    return <div className="main_page_content">
        <div className="question_panel region">

            <div id="manual_generator" className="generator" style={{ display: 'block' }}>

                <div className="page-navigation" style={{ display: 'flex', flexDirection: 'row', padding: '4px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button className="add-answer-btn" style={{ display: 'flex' }} onClick={handleSave}>Save</button>
                    <button className="delete-answer-btn " style={{ display: 'flex' }} onClick={() => setQuestionPanelShow(false)}>Exit without saving</button>

                </div>
                <div className="page_list">
                    {pages.map((page, index) => <button key={index} className={`page-tab ${selectedPage !== null && selectedPage.pageNumber === page.pageNumber ? "active-page" : ""}`} onClick={() => setSelectedPage(page)}>Page {index + 1}</button>)}

                    <button className="page-tab new-page" onClick={handleNewPage}>New Page</button>

                    <button className="page-tab delete-page" onClick={deletePage}>Delete Page</button>
                </div>

                <div className="questions" id="questionsContainer">
                    <div className="buttons">
                        <button className="button" id="newQuestionButton" style={{ marginTop: "10px" }} onClick={() => {
                            setIsQuestionPopupVisable(true)
                        }}>New Question</button>
                        <button className="button" id="import_textbank" style={{ marginTop: "10px" }} onClick={() => setIsTestBankImporterVisable(true)}>Import From Test Bank</button>
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable key={`questions-page-${selectedPage.pageNumber}`} droppableId={`questions-page-${selectedPage.pageNumber}`}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {selectedPage.questions.map((question, index) => {
                                        switch (question.type) {
                                            case "multiple-choice-single-answer":
                                                return <Draggable key={question.type + "-" + index} draggableId={question.type + "-" + index} index={index} >
                                                    {(provided, snapshot) => (
                                                        <div ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="question mcq" >
                                                            <div className="question_content">
                                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                    <span>{index + 1}{") "}{question.text}</span>
                                                                    <span className="points">{question.points} Point</span>
                                                                </div>
                                                                <span className="edit_delete">
                                                                    <h5 style={{ color: question.isTestBank ? "red" : "gray" }}>{question.isTestBank ? "(Test Bank)" : "* New"}&nbsp;</h5>
                                                                    <h5 style={{ color: question.isAiGenerated ? "blue" : "green" }}>{question.isAiGenerated ? "AI" : "Manual"}&nbsp;</h5>
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
                                                        </div>)}
                                                </Draggable>
                                            case "true/false":
                                                return <Draggable key={question.type + "-" + index} draggableId={question.type + "-" + index} index={index} >
                                                    {(provided, snapshot) => (
                                                        <div ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="question true_false"
                                                        >
                                                            <div className="question_content">
                                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                    <span>{index + 1}{") "}{question.text}</span>
                                                                    <span className="points">{question.points} Point</span>
                                                                </div>
                                                                <span className="edit_delete">
                                                                    <h5 style={{ color: question.isTestBank ? "red" : "gray" }}>{question.isTestBank ? "(Test Bank)" : "* New"}&nbsp;</h5>
                                                                    <h5 style={{ color: question.isAiGenerated ? "blue" : "green" }}>{question.isAiGenerated ? "AI" : "Manual"}&nbsp;</h5>
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
                                                        </div>)}
                                                </Draggable>
                                            case "short-answer":
                                                return <Draggable key={question.type + "-" + index} draggableId={question.type + "-" + index} index={index} >
                                                    {(provided, snapshot) => (
                                                        <div ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="question short_answer"
                                                        >
                                                            <div className="question_content">
                                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                    <span>{index + 1}{") "}{question.text}</span>
                                                                    <span className="points">{question.points} Point</span>
                                                                </div>
                                                                <span className="edit_delete">
                                                                    <h5 style={{ color: question.isTestBank ? "red" : "gray" }}>{question.isTestBank ? "(Test Bank)" : "* New"}&nbsp;</h5>
                                                                    <h5 style={{ color: question.isAiGenerated ? "blue" : "green" }}>{question.isAiGenerated ? "AI" : "Manual"}&nbsp;</h5>
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
                                                    )}
                                                </Draggable>
                                            case "multiple-choice-multiple-answer":
                                                return <Draggable key={question.type + "-" + index} draggableId={question.type + "-" + index} index={index} >
                                                    {(provided, snapshot) => (
                                                        <div ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="question checkbox"
                                                        >
                                                            <div className="question_content">
                                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                    <span>{index + 1}{") "}{question.text}</span>
                                                                    <span className="points">{question.points} Point</span>
                                                                </div>
                                                                <span className="edit_delete">
                                                                    <h5 style={{ color: question.isTestBank ? "red" : "gray" }}>{question.isTestBank ? "(Test Bank)" : "* New"}&nbsp;</h5>
                                                                    <h5 style={{ color: question.isAiGenerated ? "blue" : "green" }}>{question.isAiGenerated ? "AI" : "Manual"}&nbsp;</h5>
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
                                                        </div>)}
                                                </Draggable>
                                        }
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>


                {<TestBankImporter isPopupVisable={isTestBankImporterVisable}
                    setIsPopupVisable={setIsTestBankImporterVisable}
                    handleAddQuestions={handleImportFromTestBank} />}


                {isEditQuestionPopupVisable && <QuestionPopup handleAddQuestion={handleEditQuestion}
                    isQuestionPopupVisable={isEditQuestionPopupVisable}
                    setIsQuestionPopupVisable={setIsEditQuestionPopupVisable}
                    questionOrder={editedQuestion.order + 1}
                    pageNumber={selectedPage.pageNumber}
                    editedQuestion={{ ...editedQuestion, isTestBank: false }}
                />}


                {isQuestionPopupVisable && <QuestionPopup handleAddQuestion={handleAddQuestion}
                    isQuestionPopupVisable={isQuestionPopupVisable}
                    setIsQuestionPopupVisable={setIsQuestionPopupVisable}
                    questionOrder={selectedPage.questions.length + 1}
                    pageNumber={selectedPage.pageNumber}

                />}



                <div className="page-navigation">
                    <button id="prevPage" className="button"
                        style={{ backgroundColor: selectedPage.pageNumber - 1 <= 0 ? "gray" : "" }}
                        disabled={selectedPage.pageNumber - 1 <= 0}
                        onClick={handlePrevPage}>Make Previous</button>
                    <button id="nextPage" className="button"
                        style={{ backgroundColor: selectedPage.pageNumber + 1 > pages.length ? "gray" : "" }}
                        disabled={selectedPage.pageNumber + 1 > pages.length}
                        onClick={handleNextPage}>Make Next</button>
                </div>
            </div>

        </div >

    </div >
}
export default QuestionsPanel