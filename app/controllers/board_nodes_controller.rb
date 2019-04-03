class BoardNodesController < ApplicationController


	def show
		@board_node = BoardNode.find(params[:id])
		render json: @board_node
	end



	def new
		@board_node = BoardNode.new
		render json: @board_node
	end

	def edit
		@board_node = BoardNode.find(params[:id])

	end

	def update
		@board_node = BoardNode.find(params[:id])
		@board_node.update(board_node_params)
	end


	def create

		@board_node = BoardNode.create(board_node_params)
		#render json: user

		respond_to do |format|
			format.json { render json: @board_node }
		end

	end

	private

	def board_node_params
		params.require(:board_node).permit(:quiz_id,:score, :name)
	end

	helper_method :specific_node
	def specific_node(id_number)
		@specific_node ||= BoardNode.find(params[id_number])
	end



end
