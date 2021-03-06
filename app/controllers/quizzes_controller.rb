class QuizzesController < ApplicationController
	
	def index
		@quizzes = Quiz.all
		@board_nodes = BoardNode.all
	end

	def scores
		
		@board_nodes = BoardNode.all
		@quizzes = Quiz.paginate(page: params[:page], per_page: 20).order('id DESC')


	end

	def show
		@quiz = Quiz.find(params[:id])

	end

	def new
		@quiz = Quiz.new
		render json: @quiz
	end

	def create

		@quiz = Quiz.create(quiz_params)
		#render json: user

		respond_to do |format|
			format.json { render json: @quiz }
		end

	end

	private

	def quiz_params
		params.require(:quiz).permit(:quiz_taker,:quiz_type,:score,:rank)
	end

	





end
