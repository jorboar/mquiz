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









//plays tone at given hertz
	function playTone(note){
		
		if (note.label == "root") {
			console.log("-----playing the " + note.label + ", " + note.name + ", " + "at " + note.hertz + " hertz");
		} else {
			console.log("-----playing " + note.name + " at " + note.hertz + " hertz");
		}

		var oscillator = audioctx.createOscillator();
		var gainNode = audioctx.createGain();

		oscillator.type = 'sawtooth';
		oscillator.frequency.setValueAtTime(note.hertz, audioctx.currentTime);

		//oscillator.connect(audioctx.destination);
		gainNode.connect(audioctx.destination);
		oscillator.connect(gainNode);

		oscillator.start(audioctx.currentTime);
		gainNode.gain.setValueAtTime(0.01, audioctx.currentTime);
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


//creates answer button with given variable name, text, and element to append to
	function createAnswerButton(buttonName, buttonText, element) {
	
		var buttonName = document.createElement("BUTTON");
		var t = document.createTextNode(buttonText);
		buttonName.appendChild(t);
		document.getElementById(element).appendChild(buttonName);

		buttonName.addEventListener('click', function(){

			answer(current_question,thequiz,buttonText);

		});

	}



//generates a random number on or between minimum to maximum
	function randNum(min, max) {
  		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}