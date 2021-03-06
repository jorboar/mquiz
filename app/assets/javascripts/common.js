var Note = function(name, label, hertz, steps){
	this.name = name;
	this.label = label;
	this.hertz = hertz;
	this.steps = steps;
}

var Quiz = function(question_total,type){
		this.question_total = question_total;
		this.strikes = 0;
		this.array = new Array(question_total);
		this.total_points = 0;
		this.type = type;
}

Quiz.prototype.get_question = function(id){
		return this.array[id]
	}

Quiz.prototype.set_question = function(id,question){
		this.array[id] = question;
	}

Quiz.prototype.get_strikes = function(){
		return this.strikes;
	}

Quiz.prototype.get_total_points = function() {
	return this.total_points;
}

Quiz.prototype.add_strike = function(){
	this.strikes = this.strikes + 1;
}

Quiz.prototype.add_points = function(number) {
	this.total_points = this.total_points + number;

}

var timeouts = [];
var volume = 0.10;
var slider = 20;

var waveType = 'triangle';

//changes waveType to given text
waveTypeChange = function(type){
	waveType = type;
	waveName.html("▾ Playback wave type: " + waveType);
};

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioctx = new AudioContext();

//plays tone for given note
//accesses note general note data
function playTone(note){	
	
	var oscillator = audioctx.createOscillator();
	var gainNode = audioctx.createGain();

	oscillator.type = waveType;
	oscillator.frequency.setValueAtTime(note.hertz, audioctx.currentTime);

	//oscillator.connect(audioctx.destination);
	gainNode.connect(audioctx.destination);
	oscillator.connect(gainNode);

	oscillator.start(audioctx.currentTime);
	gainNode.gain.setValueAtTime(volume, audioctx.currentTime);
	oscillator.stop(audioctx.currentTime + 0.6);
}

//plays note at given hertz
function playExampleTone(hertz){
	
	//console.log("-----playing " + hertz + " hertz");
	
	var oscillator = audioctx.createOscillator();
	var gainNode = audioctx.createGain();

	oscillator.type = waveType;
	oscillator.frequency.setValueAtTime(hertz, audioctx.currentTime);

	//oscillator.connect(audioctx.destination);
	gainNode.connect(audioctx.destination);
	oscillator.connect(gainNode);

	oscillator.start(audioctx.currentTime);
	gainNode.gain.setValueAtTime(volume, audioctx.currentTime);
	oscillator.stop(audioctx.currentTime + 0.6);
}


//checks answer ("input") of given question index per quiz object
//increases current_question variable by 1
function answer(index, quiz, input) {

	toggleEventListeners(false);

	quiz.get_question(index).set_submittedanswer(input);
	
	let result = "CORRECT";

	//adds strike to quiz if answer is incorrect
	//also runs check_answer in this line which provides important data for question
	if(!quiz.get_question(index).check_answer()){
		quiz.add_strike();
		result = "INCORRECT";
	}
	
	//adds question points to total points
	quiz.add_points(quiz.get_question(index).points);

	current_question = current_question + 1;

	//displays unique response for quiz type after question is answered
	if (quiz.type == "interval") {

		let grammar = "a";

		if (quiz.get_question(index).note1.label == "Octave") {
			grammar = "an";
		}
		dataElement.html("<b>" + result + "</b>! " + quiz.get_question(index).note1.name + " + " + quiz.get_question(index).note2.name + " is " + grammar + " " + quiz.get_question(index).note1.label);

	} else if (quiz.type == "chord") {

		dataElement.html("<b>" + result + "</b>! " + note1.name + ", " + note2.name + ", and " + note3.name + " create a " + note2.label + " chord." );

	} else if (quiz.type == "scale") {

		dataElement.html("<b>" + result + "</b>! This scale is " + note1.name + " " + note1.label + ".");
	}

	timeouts.push(setTimeout(function(){

		let endless = false;
		if (quiz.question_total===0) {

			if (quiz.strikes > 0) {
				endless = true;
				end(quiz);
			}

		}

		if (quiz.question_total===current_question) {
		
			end(quiz);
		
		} else {
			if (!endless) {
				present_question(current_question,quiz)
			}

		}
	}, 3200));

}



//creates answer button with given text and element to append to
function createAnswerButton(buttonText, element) {

	var button = function() {
		this.button = document.createElement("BUTTON");
		
		this.listener = function(){
			answer(current_question,thequiz,buttonText);
		};
	}

	buttonName = new button();

	var t = document.createTextNode(buttonText);
	buttonName.button.appendChild(t);
	document.getElementById(element).appendChild(buttonName.button);

	buttonName.button.addEventListener('click', buttonName.listener);

	return buttonName
}

//creates playback button with given text, note number, and element to append to
function createNoteButton(text, noteNumber, element){

	var button = function() {
		this.button = document.createElement("BUTTON");
		this.listener = function(){

		playTone(thequiz.get_question(current_question)["note" + noteNumber]);

		};

	}

	buttonName = new button();

	var t = document.createTextNode(text);
	buttonName.button.appendChild(t);
	document.getElementById(element).appendChild(buttonName.button);

	//$("<button></button").text(text);
	//$(element).append()

	buttonName.button.addEventListener('click', buttonName.listener);

	return buttonName

}

//generates a random number on or between minimum to maximum
function randNum(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//censors user submitted names with profanity which are stored under the "gimme" variable
function nameCensor(){
	return $.ajax({
		    type: "GET",
		   	url: ["https://www.purgomalum.com/service/json?text="+gimme],						
		   	success: function(data) {
			        gimme = data.result;
			    }
			});
}

//runs all logic for maintaining top 10 boards
//quiz type is needed in constructor
function logtop10 (quiz_name) {

	if (gimme=="") {
		gimme = "Anonymous";
	}

	var lastID;
	var lastScore;
	var lastName;

	var nodeID;
	var nodeScore;
	var nodeName;

	var nextID;
	var nextScore;
	var nextName;

	var found = false;

	var mod = 0;

	if (quiz_name == "Chord Quiz") {
		mod = 10;
	}

	if (quiz_name == "Scale Quiz") {
		mod = 20;
	}

	if (quiz_name == "Interval Endless") {
		mod = 30;
	}

	if (quiz_name == "Chord Endless") {
		mod = 40;
	}

	if (quiz_name == "Scale Endless") {
		mod = 50;
	}

	//submits score to general quiz database and grabs data to be used for top 10 comparison
	function ajax1() {

		return	$.ajax({
				type: "POST",
				url: "/quizzes",
				data: {quiz: {
					quiz_type: quiz_name,
					quiz_taker: gimme,
					score: points,
					rank: 0
					}
				},

				success: function(data) {
	    			lastID = data.id;
	    			lastScore = data.score;
	    			lastName = data.quiz_taker;
				}
			});
	}

	$.when(ajax1()).done(function(){

			boardcomparison((1+mod));
			
	});

	//recursively runs ajax2 and then runs moveNodes() if a score is needed to be put onto board
	function boardcomparison(i) {

		if (found){
			i = 11+mod;
			moveNodes(nodeID,nodeScore,nodeName);
		}

		if (i < (11+mod) ) {
			$.when(ajax2(i)).done(function(){
				//console.log("running boardcomparison with " + (i+1));
				return boardcomparison(i + 1)
    		});
		}
	}

	//reads through board nodes to find if the most recent submitted data beats any node's score
	//stores old node data under initial get request, then patches with new data from user submission
	function ajax2(i) {

		return $.get(["/board_nodes/" + i], function (data) {
			
			nodeID = data.id;
			nodeScore = data.score;
			nodeName = data.name;


			if (lastScore >= data.score)  {

				found = true;

				nextID = nodeID;

				$.ajax({
	    			type: "PATCH",
	    			url: ["/board_nodes/" + i],
	    			data: {board_node: {
		   				quiz_id: lastID,
		   				score: lastScore,
		   				name: lastName
		   				}
		    		}
		    	});

			}
		})

	}

	//recursively runs ajax3
	function moveNodes(id, score, name) {

		if (nextID < (10+mod) ) {
			$.when(ajax3(id,score,name)).done(function(){
				return moveNodes(nextID, nextScore, nextName)
    		});
		}
	}

	//moves old top 10 scores down
	function ajax3(id,score,name){

		return $.get(["/board_nodes/" + (id+1)], function (data) {
			
			nextID = nextID + 1;
			nextScore = data.score;
			nextName = data.name;
			//console.log("writing nextID as " + nextID);
		})

		.done(function(){

			$.ajax({
				type: "PATCH",
				url: ["/board_nodes/" + (id+1)],
				data: {board_node: {
				quiz_id: id,
				score: score,
				name: name
					}
				}		
			});
		});	    	
	}

}

