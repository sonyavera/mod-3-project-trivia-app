QUIZ_URL = "http://localhost:3000/quizzes/"
NEW_PATH = "new"
FIND_PATH = "find"
SCORE_PATH = "/score"
let correctAnswers = []
let userAnswers = new Array(10);
const questionsContainer = document.querySelector("#questions-container")

const params = getParams(window.location.href);
// console.log(params)
retrieveQuiz(params)

    const renderQuizQuestions = (questionsHash) => {

        questionsContainer.dataset.current_quiz_id = Object.keys(questionsHash)[0]
        const questionsArray = Object.values(questionsHash)[0]
        for(let i = 0; i < questionsArray.length; i++){ 
            const questionDiv = document.createElement("div")
            questionDiv.dataset.question_id = i
            questionDiv.id = "question-div"
            let answersArr = questionsArray[i]["incorrect_answers"]
            const correctAnswer = questionsArray[i]["correct_answer"]
            correctAnswers.push(correctAnswer)
            answersArr.push(correctAnswer)        
            shuffleArray(answersArr)        
            const question = document.createElement("h3")
            question.innerHTML = `${questionsArray[i]["question"]}`
            questionDiv.innerHTML =
            `
            <input type="radio" class="radio-node" id="answer-one" name="${i}" value="${answersArr[0]}">
            <label class="question-choice" for="${answersArr[0]}">${answersArr[0]}</label><br>
            <input type="radio" class="radio-node" id="answer-two" name="${i}" value="${answersArr[1]}">
            <label class="question-choice" for="${answersArr[1]}">${answersArr[1]}</label><br>
            <input type="radio" class="radio-node" id="answer-three" name="${i}" value="${answersArr[2]}">
            <label class="question-choice" for="${answersArr[2]}">${answersArr[2]}</label><br>
            <input type="radio" class="radio-node" id="answer-four" name="${i}" value="${answersArr[3]}">
            <label class="question-choice" for="${answersArr[3]}">${answersArr[3]}</label>
            `
            questionsContainer.append(question)
            question.append(questionDiv)
            
            }
        console.log(correctAnswers)
    }
    
document.addEventListener("DOMContentLoaded", () => {
    let score = 0

    

    const changeHandler = () => {
        document.addEventListener("change", (e) => {
            if(e.target.matches(".radio-node")){

                const questionIndex = e.target.parentElement.dataset.question_id
                userAnswers[questionIndex] = e.target.value
                if(e.target.value === decodeHTML(correctAnswers[parseInt(e.target.name)])){
                    score += 1
                    const questionDiv = e.target.parentNode
                    const divNodes = e.target.parentNode.children
                    for (const node of divNodes){
                        if(node.type == "radio"){
                            node.disabled = true
                        }
                    }
                }else if (e.target.value !== correctAnswers[parseInt(e.target.name)]){
                    const questionDiv = e.target.parentNode
                    const divNodes = e.target.parentNode.children
                    for (const node of divNodes){
                        if(node.type == "radio"){
                            node.disabled = true
                        }
                    }
                }
            }   
        })
    }

    const clickHandler = () => {
        document.addEventListener("click", (e) => {
            if(e.target.id === "submit-quiz-button"){ 
                // const nickname = document.querySelector("#nickname").value
                // const nicknameForm = document.querySelector("#nickname-form").remove()
                const scoreMessage = document.createElement("div")
                scoreMessage.innerHTML = `Congrats! You got a ${score}/10. <a href="../index.html">Take another quiz</a>`
                questionsContainer.prepend(scoreMessage)
                scroll(0,0)
                const body = e.target.parentNode
                for(let i=0; i < correctAnswers.length; i++){
                    if(correctAnswers[i] === userAnswers[i]){
                        const divToColorChange = document.querySelector(`[data-question_id="${i}"]`)
                        divToColorChange.style.color = "green";
                    }
                    else if(correctAnswers[i] !== userAnswers[i]){
                        const divToColorChange = document.querySelector(`[data-question_id="${i}"]`)
                        divToColorChange.style.color = "red";
                    }
                }
                const quizID = document.querySelector("#questions-container").dataset.current_quiz_id
                updateQuizResult(score, quizID) //we need to get the nickname another way
            }
            
        })
    }

    const updateQuizResult = (quizScore, quizID) => {
        
        option = {
            method: "PATCH",
            headers: {
            "content-type": "application/json",
            "accept": "application/json"
            },
            body: JSON.stringify({
                score: quizScore   
            })
        }
        fetch(QUIZ_URL + quizID + SCORE_PATH, option)
        .then(response => response.json())
        // .then(console.log())
    }



    changeHandler()
    clickHandler()
})