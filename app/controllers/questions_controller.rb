class QuestionsController < ApplicationController

	def index
		render json: Question.all
	end

	def show
		@question = Question.find(params[:id])
		render json: question
	end

	def create
		@question = question.new(question_params)
		#render json: user

		respond_to do |format|
			format.json { render json: @question }

		end

	end

	private

	def question_params
		params.require(:question).permit(:question_text, :result)
	end
	

end
