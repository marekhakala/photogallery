class AuthnController < ApplicationController
  before_action :authenticate_user!, only: [:checkme]

  def whoami
    @roles = current_user.roles.application.pluck(:role_name, :mname) if @user = current_user
  end

  def checkme
    render json: current_user || {}
  end
end
