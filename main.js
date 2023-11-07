
//  select element 

let countSpan = document.querySelector('.quiz-info .count span');
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answerArea = document.querySelector('.answer-area');
let submitButton = document.querySelector('.submit');
let bullets = document.querySelector('.bullets');
let resultsContainer = document.querySelector('.results');
let countdownEle = document.querySelector('.countdown');


// set options 
let currentIndex = 0;
let rightAnswer = 0;
let coundownInterval;


function getQuestion (){
    let myReqest = new XMLHttpRequest();

    myReqest.onreadystatechange = function(){
        if(this.readyState === 4  && this.status === 200  ){
            // console.log(this.responseText);
            let questionObject =  JSON.parse(this.responseText);
            let questionscount = questionObject.length;
            
            //  create bullets + set questions count
            createBullets(questionscount);

            // add questions data 
            addQuestionsData(questionObject[currentIndex],questionscount);

            // count down fnction 
            countDown(10,questionscount);

            // click on submit button
            submitButton.onclick = function(){
                
                // get right answer 
                let theRightAnswer = questionObject[currentIndex].right_answer;
                console.log(theRightAnswer);

                // icrease index 
                currentIndex++;

                // check the answer 
                checkAnswer(theRightAnswer,questionscount);

                //  remove previous questions 
                quizArea.innerHTML ='';
                answerArea.innerHTML='';

                // add questions data 
                addQuestionsData(questionObject[currentIndex],questionscount);

                // handel  bullets class 
                handelBullets();

                 // count down fnction 
                clearInterval(coundownInterval);
                countDown(10,questionscount);

                // show results
                showResults(questionscount);
            };
        }
    };
    myReqest.open("GET","html_questions.json",true);
    myReqest.send();
}
getQuestion();

// create createBullets function 
function createBullets(num){
    countSpan.innerHTML = num;

    // create spans 
    for(let i=0; i<num; i++){

        // create span 
        let theBullet = document.createElement("span");

        // add class on to the first question
        if(i === 0){
            theBullet.className="on"; 
        }
        // append bullets to bullet container
        bulletsSpanContainer.appendChild(theBullet);
    }
}

// create addQuestionsData function

function  addQuestionsData(obj,count){
    if(currentIndex < count){
        // console.log(obj);

    // create h2 question
    let questionTitle = document.createElement("h2");

    // ceate question text
    let questionText = document.createTextNode(obj['title']);

    // append text to h2
    questionTitle.appendChild(questionText);

    // append h2 to quizArea
    quizArea.appendChild(questionTitle);

    // create answer
    for(let i=1 ; i<5; i++){
        
        // create main answer div
        let mainDiv = document.createElement("div");
        
        // add class answer to maindiv
        mainDiv.className='answer';

        // create radio input
        let radioInput = document.createElement("input");

        // add types + id + Data Attributes 
        radioInput.name='questions';
        radioInput.type='radio';
        radioInput.id= `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        //  make first option 
        // if(i === 1){
        //     radioInput.checked = true;
        // }

        // create label 
        let theLabel = document.createElement("label");

        // add for attribute
        theLabel.htmlFor = `answer_${i}`;

        // create label text 
        let theLabelText  = document.createTextNode(obj[`answer_${i}`]);

        // add the text to label
        theLabel.appendChild(theLabelText);

        // add input + label t maindiv
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        // append all main div to answer area
        answerArea.appendChild(mainDiv); 

    }
    }
}

//  create the 
function checkAnswer(rightAnswerToCompare , qcount){

    let answers = document.getElementsByName("questions");
    let theChooseAnswer;

    for(let i=0; i<answers.length; i++){

        if(answers[i].checked ){
            theChooseAnswer = answers[i].dataset.answer;
        }

    }
    console.log(` right answer is : ${rightAnswer} `);
    console.log(` choosen answer is : ${theChooseAnswer} `);

    if(rightAnswerToCompare === theChooseAnswer ){
        rightAnswer = rightAnswer + 1;
        console.log("good");
        console.log(rightAnswer);
    }
}

// create function handelBullets
function handelBullets(){

    let buletsSpans = document.querySelectorAll('.bullets .spans span');
    let arrarOfSpans = Array.from(buletsSpans);

    arrarOfSpans.forEach((span , index) => {
        if(currentIndex === index){
            span.className = 'on';
        }
    });
}

// create showResults
function showResults(count){
    if(currentIndex === count){
        let theResults ;
        console.log("question is finished");

        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswer === 1 ){
            theResults  = ` <span class="good"> Good </span> ,    ${rightAnswer} from ${count} Is Good.`;
        }else if(rightAnswer === count ){
            theResults  = `<span class="perfect"> All Ansers is Correct </span>`;
        }else{
            theResults  = `<span class="bad"> you answer ${rightAnswer} from ${count} </span>`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = '10px';
        resultsContainer.style.backgroundColor = 'white';
        resultsContainer.style.marginTop = '10px';

    }
}

//  create countdown 
function countDown(duration , count){
    if(currentIndex < count){
        let minutes  , seconds;
        coundownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes>10 ? `0${minutes}` :`${minutes}` ;
            seconds = seconds<10 ? `0${seconds}` :`${seconds}` ;
            countdownEle.innerHTML =` ${minutes} : ${seconds} `; 

            if(--duration < 0){
                clearInterval(coundownInterval);
                submitButton.click();
            }
        },1000);
    }
}

