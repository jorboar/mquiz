Rails.application.routes.draw do
  get 'controller/questions'

	root 'static_pages#index'
	get 'interval', to: 'static_pages#interval'
	get 'chord', to: 'static_pages#chord'

	resources :questions
	resources :quizs
	resources :users
end
