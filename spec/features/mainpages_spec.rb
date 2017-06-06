require 'rails_helper'

RSpec.feature "Mainpages", type: :feature, js: true do
  context "when the main page is accessed" do
    before(:each) do
      visit "/"
    end

    it "displays the index.html launch page" do
      expect(page).to have_content(/Hello \(from .+index.html.*\)/)
    end

    it "index page has bootstrap styling" do
      expect(page).to have_css("div.container")
    end

    it "displays the main application page" do
      expect(page).to have_content("Sample App (from spa/pages/main.html)")
    end

    it "displays the foos tile" do
      expect(page).to have_content("Foos (from spa/foos/foos.html)")
    end
  end
end
