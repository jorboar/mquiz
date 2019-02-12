class QuestionsController < ApplicationController

	def index
		render json: Question.all
	end


	def new
		@question = Question.new
		render json: quiz
	end


	def show
		@question = Question.find(params[:id])
		render json: question
	end

	def create
		@question = Question.create(question_params)

		respond_to do |format|
			format.json { render json: @question }

		end

	end

	private

	def question_params
		params.require(:question).permit(:quiz_id, :question_text, :result, :score)
	end
	

end
