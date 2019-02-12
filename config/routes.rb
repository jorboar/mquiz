Rails.application.routes.draw do
  get 'controller/questions'

	root 'static_pages#index'
	get 'interval', to: 'static_pages#interval'
	get 'chord', to: 'static_pages#chord'
	get 'scale', to: 'static_pages#scale'
	get 'about', to: 'static_pages#about'

	
	resources :quizzes do 
		resources :questions	
	end
end
