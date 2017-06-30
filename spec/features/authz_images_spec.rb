require 'rails_helper'
require_relative '../support/subjects_ui_helper.rb'
require_relative '../support/image_content_helper.rb'

RSpec.feature "AuthzImages", type: :feature, js: true do
  include_context "db_cleanup_each"
  include SubjectsUiHelper
  include ImageContentHelper

  let(:authenticated) { create_user }
  let(:originator) { create_user }
  let(:organizer) { originator }
  let(:admin) { apply_admin create_user }
  let(:image_props) { FactoryGirl.attributes_for(:image) }
  let(:images) { FactoryGirl.create_list(:image, 3, :with_caption,
    :with_roles, sizes: 1, creator_id: originator[:id]) }
  let(:image) { images[0] }

  shared_examples "can list images" do
    it "lists images" do
      visit_images images

      within("sd-image-selector .image-list") do
        images.each do |img|
          expect(page).to have_css("li a", text: img.caption)
          expect(page).to have_css(".image_id", text: img.id, visible: false)
          expect(page).to have_no_css(".image_id")
        end
      end
    end
  end

  shared_examples "displays correct buttons for role" do |displayed, not_displayed|
    it "displays correct buttons" do
      within("sd-image-editor .image-form") do
        displayed.each do |button|
          disabled_value = ["Update Image", "Create Image"].include? button
          expect(page).to have_button(button, disabled: disabled_value, wait: 5)
        end

        not_displayed.each do |button|
          expect(page).to have_no_button(button)
        end
      end
    end
  end

  shared_examples "can create image" do
    it "creates image" do
      within("sd-image-editor .image-form") do
        expect(page).to have_button("Create Image", disabled: true, wait: 5)
        expect(page).to have_field("image-caption", readonly: false)

        fill_in("image-caption", with: image_props[:caption])
        expect(page).to have_field("image-caption", with: image_props[:caption])
        attach_file("image-file", image_filepath)

        if (page.has_css?("span.invalid", text: /.+/))
          fail(page.find("span.invalid", text: /.+/).text)
        end

        expect(page).to have_no_css("span.invalid", text: /.+/)

        using_wait_time 20 do
          expect(page).to have_css("sd-image-loader img.image-preview")
          expect(page).to have_button("Create Image", disabled: false)
          click_button("Create Image")

          expect(page).to have_no_css("sd-image-loader img.image-preview")
          expect(page).to have_no_css("sd-image-loader")
          expect(page).to have_no_button("Create Image")
          expect(page).to have_css("div.image-existing img")
          expect(page).to have_button("Delete Image")
          expect(page).to have_button("Update Image", disabled: true)
          expect(page).to have_css("label", text: "Related Things")
          expect(page).to have_button("Clear Image", disabled: false)
          click_button("Clear Image")
        end
      end

      5.times do
        if (page.has_button?("Clear Image"))
          click_button("Clear Image")
          sleep 0.25
        else
          break
        end
      end

      within("sd-image-editor .image-form") do
          expect(page).to have_no_button("Clear Image")
          expect(page).to have_field("image-caption", with: "")
          expect(page).to have_button("Create Image", disabled: true)
      end

      within("sd-image-selector .image-list") do
        expect(page).to have_css("li a", text: /^#{image_props[:caption]}/, wait: 5)
      end
    end
  end

  shared_examples "displays image" do
    it "field filled in with clicked image caption" do
      within("sd-image-editor .image-form") do
        expect(page).to have_field("image-caption", with: image.caption)
        expect(page).to have_css(".image_id", text: image.id, visible: false)
        expect(page).to have_no_css(".image_id")
      end
    end
  end

  shared_examples "can clear image" do
    it "image caption cleared from input field" do
      image_editor_loaded! image

      within("sd-image-editor .image-form") do
        expect(page).to have_field("image-caption", with: image.caption)
        expect(page).to have_no_field("image-caption", with: "")
        click_button("Clear Image")

        expect(page).to have_no_field("image-caption", with: image.caption, wait: 5)
        expect(page).to have_field("image-caption", with: "")
        expect(page).to have_no_button("Clear Image", wait: 5)
        expect(page).to have_no_css(".id", text: image.id, visible: false)
      end
    end
  end

  shared_examples "cannot update image" do
    it "caption is not updatable" do
      within("sd-image-editor .image-form") do
        expect(page).to have_button("Clear Image", wait: 10)
        expect(page).to have_field("image-caption", with: image.caption, readonly: true)
      end
    end
  end

  shared_examples "can update image" do
    it "caption is updated" do
      new_caption = "new caption"

      within("sd-image-editor .image-form") do
        expect(page).to have_field("image-caption", with: image.caption)
        expect(page).to have_css("div.image-existing img", count: 1, wait: 5)
        expect(page).to have_button("Update Image", disabled: true)

        fill_in("image-caption", with: new_caption)
        expect(page).to have_field("image-caption", with: new_caption)
        click_button("Update Image")

        expect(page).to have_button("Update Image", disabled: true)
        expect(page).to have_field("image-caption", with: new_caption)

        5.times do
          click_button("Clear Image")
          break if page.has_no_button?("Clear Image")
        end

        expect(page).to have_no_button("Clear Image")
        expect(page).to have_field("image-caption", with: "")
        expect(page).to have_button("Create Image", disabled: true)
      end

      within("sd-image-selector .image-list") do
        expect(page).to have_css("li a", text: /^#{new_caption}/, wait: 5)
      end

      logout

      within("sd-image-selector .image-list") do
        expect(page).to have_css("li a", text: /^#{new_caption}/, wait: 5)
      end
    end
  end

  shared_examples "can delete image" do
    it "image deleted" do
      image_editor_loaded! image

      within("sd-image-editor .image-form") do
        click_button("Delete Image")

        expect(page).to have_no_button("Delete Image")
        expect(page).to have_button("Create Image", disabled: true)
      end

      within("sd-image-selector .image-list") do
        expect(page).to have_css("span.image_id", count: 2, visible: false, wait: 5)
        expect(page).to have_no_css("span.image_id", text: image.id, visible: false)
      end
    end
  end

  context "no image selected" do
    after(:each) { logout }

    context "unauthenticated user" do
      before(:each) do
        logout
        visit_images images
      end

      it_behaves_like "can list images"
      it_behaves_like "displays correct buttons for role",
            [], ["Create Image", "Clear Image", "Update Image", "Delete Image"]
    end

    context "authenticated user" do
      before(:each) do
        login authenticated
        visit_images images
      end

      it_behaves_like "can list images"
      it_behaves_like "displays correct buttons for role",
            ["Create Image"], ["Clear Image", "Update Image", "Delete Image"]
      it_behaves_like "can create image"
    end

    context "organizer user" do
      before(:each) do
        login organizer
        visit_images images
      end

      it_behaves_like "displays correct buttons for role",
            ["Create Image"], ["Clear Image", "Update Image", "Delete Image"]
      it_behaves_like "can create image"
    end

    context "admin user" do
      before(:each) do
        login admin
        visit_images images
      end

      it_behaves_like "displays correct buttons for role",
            ["Create Image"], ["Clear Image", "Update Image", "Delete Image"]
      it_behaves_like "can create image"
    end
  end

  context "images posted" do
    before(:each) { visit_images images }
    after(:each) { logout }

    context "user selects image" do
      before(:each) do
        find("div.image-list .id", text: image.id, visible: false).find(:xpath, "..").trigger('click')
      end

      it_behaves_like "displays image"

      context "unauthenticated user" do
        before(:each) do
          logout
          find(".image-controls", wait: 5)
        end

        it_behaves_like "displays correct buttons for role",
              ["Clear Image"], ["Create Image", "Update Image", "Delete Image"]
        it_behaves_like "can clear image"
        it_behaves_like "cannot update image"
      end

      context "authenticated user" do
        before(:each) do
          login authenticated
          find(".image-controls", wait: 5)
        end

        it_behaves_like "displays correct buttons for role",
              ["Clear Image"], ["Create Image", "Update Image", "Delete Image"]
        it_behaves_like "can clear image"
        it_behaves_like "cannot update image"
      end

      context "organizer user" do
        before(:each) do
          login organizer
          find(".image-controls > span", wait: 5)
        end

        it_behaves_like "displays correct buttons for role",
              ["Clear Image", "Update Image", "Delete Image"], ["Create Image"]
        it_behaves_like "can clear image"
        it_behaves_like "can update image"
        it_behaves_like "can delete image"
      end

      context "admin user" do
        before(:each) do
          login admin
          find(".image-controls > span", wait: 5)
        end

        it_behaves_like "displays correct buttons for role",
              ["Clear Image", "Delete Image"], ["Create Image", "Update Image"]
        it_behaves_like "can clear image"
        it_behaves_like "cannot update image"
        it_behaves_like "can delete image"
      end
    end
  end
end
