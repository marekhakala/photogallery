module UiHelper
  def fillin_signup registration
    visit "#{ui_path}/#/signup" unless page.has_css?("#signup-form")

    using_wait_time 5 do
      expect(page).to have_css("#signup-form")
    end

    fill_in("signup-email", with: registration[:email])
    fill_in("signup-name", with: registration[:name])
    fill_in("signup-password", with: registration[:password])

    password_confirm = registration[:password_confirmation] ||= registration[:password]
    fill_in("signup-password_confirmation", with: password_confirm)
  end

  def signup registration, success = true
    fillin_signup registration
    click_on("Sign Up")

    if success
      expect(page).to have_no_button("Sign Up")
    else
      expect(page).to have_button("Sign Up")
    end
  end

  def logged_in? account = nil
    account ?
      page.has_css?("#navbar-loginlabel", text: /#{account[:name]}/) :
      page.has_css?("#user_id", visible: false)
  end

  def fillin_login credentials
    visit root_path unless page.has_css?("#navbar-loginlabel")
    find("#navbar-loginlabel", text: "Login").click

    within("#login-form") do
      fill_in("login_email", with: credentials[:email])
      fill_in("login_password", with: credentials[:password])
    end
  end

  def login credentials
    fillin_login credentials
    within("#login-form") do
      click_button("Login")
    end

    using_wait_time 5 do
      expect(page).to have_no_css("#login-form")
    end

    expect(page).to have_css("#logout-form", visible: false)
    expect(page).to have_css("#navbar-loginlabel", text: /#{credentials[:name]}/)
  end

  def logout
    if logged_in?
      find("#navbar-loginlabel").click
      find_button("Logout").click
      expect(page).to have_no_css("#user_id", visible: false)
    end
  end
end
