Rails.application.routes.draw do
  get 'controller/questions'

	root 'static_pages#index'
	get 'interval', to: 'static_pages#interval'
	get 'chord', to: 'static_pages#chord'
	get 'scale', to: 'static_pages#scale'

	resources :questions
	resources :quizs
	resources :users
end
