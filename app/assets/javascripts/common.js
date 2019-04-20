var Note = function(name, label, hertz, steps){
	this.name = name;
	this.label = label;
	this.hertz = hertz;
	this.steps = steps;
}

var Quiz = function(question_total){
		this.question_total = question_total;
		this.strikes = 0;
		this.array = new Array(question_total);
		this.total_points = 0;
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
		
	if (note.label == "root") {
		console.log("-----playing the " + note.label + ", " + note.name + ", " + "at " + note.hertz + " hertz");
	} else {
		console.log("-----playing " + note.name + " at " + note.hertz + " hertz");
	}

	console.log(volume);		
	
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
	
	console.log("-----playing " + hertz + " hertz");
	
	console.log(volume);
	
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

	quiz.get_question(index).set_submittedanswer(input);
	
	//adds strike to quiz if answer is incorrect
	//also runs check_answer in this line which provides important data for question
	if(!quiz.get_question(index).check_answer()){
		quiz.add_strike();
	}
	
	//adds question points to total points
	quiz.add_points(quiz.get_question(index).points);

	current_question = current_question + 1;

	if(quiz.question_total===current_question) {
		
		end(quiz);
		
	} else {
		present_question(current_question,quiz)
	}
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
	    			console.log("hey success on id: " + data.id);
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
				console.log("running boardcomparison with " + (i+1));
				return boardcomparison(i + 1)
    		});
		}
	}


	


	//reads through board nodes to find if the most recent submitted data beats any node's score
	//stores old node data under initial get request, then patches with new data from user submission
	function ajax2(i) {

		return $.get(["/board_nodes/" + i], function (data) {

			console.log("Lets go " + data.id);
			console.log(data.id + " and " + data.score);
			
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

				console.log("FOUND ON " + data.id);
			}
		})

	}

	//recursively runs ajax3
	function moveNodes(id, score, name) {

		console.log("running moveNodes with " + id + ", " + score + ", " + name);
		console.log("nextID - " + nextID);
		if (nextID < (10+mod) ) {
			$.when(ajax3(id,score,name)).done(function(){
				console.log("moving to next moveNodes with " + nextID + ", " + nextScore + ", " + nextName);
				return moveNodes(nextID, nextScore, nextName)
    		});
		}
	}

	//moves old top 10 scores down
	function ajax3(id,score,name){

		console.log("running ajax3 with " + (id + 1));

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

