UniversalCrm::Engine.routes.draw do
  root to: 'home#index'
  
  get '/logout', to: 'user_sessions#logout', as: :logout
  get '/customer/:customer_id', to: 'home#index'
  get '/company/:company_id', to: 'home#index'
  get '/ticket/:ticket_id', to: 'home#index'
  
  resource :config, controller: :config
  
  resources :customers do
    collection do
      get :autocomplete
    end
  end
  resources :companies do
    collection do
      get :autocomplete
    end
  end
  resources :tickets do
    member do
      patch :update_status, :flag
    end
  end
  resources :comments
  
end
