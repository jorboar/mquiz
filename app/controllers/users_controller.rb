class UsersController < ApplicationController

	def new
		@user = User.new
		render json: user
	end

	def create


		@user = User.create(user_params)
		#render json: user

		respond_to do |format|
			format.json { render json: @user }

		end

	end

	private

	def user_params
		params.require(:user).permit(:name)
	end



end
