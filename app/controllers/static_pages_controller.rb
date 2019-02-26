class StaticPagesController < ApplicationController


	def index
		
		#@question = Question.find(get_id) 
		
		#@quizzes = Quiz.all

		@quiz = Quiz.find(get_id)

	end

	def game
		
	end

	private

	def get_id
		id = 1

		return id
	end


end
