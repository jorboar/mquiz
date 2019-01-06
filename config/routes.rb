Rails.application.routes.draw do
	root 'static_pages#index'
	get 'game', to: 'static_pages#game'
end
