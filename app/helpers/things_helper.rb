module ThingsHelper
  def is_admin?
    @current_user and @current_user.is_admin?
  end

  def restrict_notes? user_roles
    user_roles.empty? and not is_admin?
  end
end
