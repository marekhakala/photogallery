Rails.application.routes.draw do
  root "ui#index"
  get "/ui" => "ui#index"
  get "/ui#" => "ui#index"
  get "/client-assets/:name.:format", to: redirect("/client/client-assets/%{name}.%{format}")

  scope :api, defaults: { format: :json } do
    resources :foos, except: [:new, :edit]
    resources :bars, except: [:new, :edit]
  end

  get 'authn/whoami'
  get 'authn/checkme'
  mount_devise_token_auth_for 'User', at: 'auth'
end
