Rails.application.routes.draw do
	root 'static_pages#index'
	get 'interval', to: 'static_pages#interval'
	get 'chord', to: 'static_pages#chord'
end
