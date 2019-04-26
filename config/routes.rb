Rails.application.routes.draw do
  get 'controller/questions'

	root 'quizzes#index'
	get 'interval', to: 'static_pages#interval'
	get 'intervalendless', to: 'static_pages#intervalendless'
	get 'chordendless', to: 'static_pages#chordendless'
	get 'scaleendless', to: 'static_pages#scaleendless'
	get 'chord', to: 'static_pages#chord'
	get 'scale', to: 'static_pages#scale'
	get 'about', to: 'static_pages#about'
	get 'scores', to: 'quizzes#scores'

	
	resources :quizzes 
	resources :board_nodes
end
