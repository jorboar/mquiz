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




	Question.prototype.get_answer = function(){
			return this.answer
		}

	Question.prototype.get_submittedanswer = function(){
			return this.submittedanswer
		}

	Question.prototype.set_submittedanswer = function(x){
			this.submittedanswer = x;
		}

	Question.prototype.check_answer = function(){
			if (this.answer === this.submittedanswer){
				this.correct = true;
				
				this.points = seconds * 100;

				response.html("CORRECT");

				console.log("CORRECT");
			} else {
				this.correct = false;
				this.points = 0;

				response.html("INCORRECT");

				console.log("INCORRECT")
			}
			
			this.time = seconds;


			return this.correct
		}






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

