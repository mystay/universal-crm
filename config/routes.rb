UniversalCrm::Engine.routes.draw do
  root to: 'home#index'
  
  get '/logout', to: 'user_sessions#logout', as: :logout
  get '/customer/:customer_id', to: 'home#index'
  get '/company/:company_id', to: 'home#index'
  get '/ticket/:ticket_id', to: 'home#index'
  post '/inbound', to: 'home#inbound'
  get '/inbound', to: 'home#inbound'
  post '/config/set_password', to: 'config#set_password'
  post '/config/signin', to: 'config#signin'
  get '/inbox', to: 'home#index'
  get '/actioned', to: 'home#index'
  get '/active', to: 'home#index'
  get '/closed', to: 'home#index'
  
  resource :config, controller: :config
  
  resources :attachments
  resources :customers do
    collection do
      get :autocomplete
    end
  end
  resources :companies do
    collection do
      get :autocomplete, :recent
    end
  end
  resources :tickets do
    member do
      patch :update_status, :flag
    end
  end
  resources :comments
  
end
