require 'rails_helper'
require_relative '../support/image_content_helper.rb'
require_relative '../support/subjects_ui_helper.rb'

RSpec.feature "ImageContents", type: :feature, js:true do
  include_context "db_cleanup"
  include ImageContentHelper
  include SubjectsUiHelper

  let(:originator) { apply_originator(create_user, Thing) }
  let(:organizer) { originator }
  let(:image_props) { FactoryGirl.attributes_for(:image) }

  before(:each) do
    visit ui_path
  end

  context "display existing image content" do
    include_context "db_clean_after"
    let(:thing) { @thing }
    let(:image) { thing.thing_images.first.image }
    let(:images) { Image.all }

    before(:each) do
      @thing = Thing.first

      unless @thing
        @thing = FactoryGirl.create(:thing, :with_roles,
            :with_image, originator_id: organizer[:id], image_count: 3)
      else
        apply_organizer(organizer, @thing)
      end
      login organizer
    end

    it "can display thumbnails in image list" do
      visit_images
      within("sd-image-selector .image-list") do
        expect(page).to have_css("li", count: images.count)
        img = find(".image_id", text: image.id, visible: false).find(:xpath, "..")

        within(img) do
          expect(img[:text]).to include(image.caption) if image.caption
          expect(img[:text]).to match(/^\s*$/) unless image.caption
          expect(page).to have_css("img[src*='#{image_content_path(image, width: 50)}']")
        end
      end
    end

    it "can display image content for selected" do
      visit_images

      within("sd-image-selector .image-list") do
        find(".image_id", text: image.id, visible: false).find(:xpath, "..").click
      end

      expect(page).to have_no_css("sd-image-selector .image-list li", wait: 5)

      within("sd-image-editor .image-form") do
        expect(page).to have_css("span.image_id", text: image.id, visible: false, wait: 5)
        expect(page).to have_field("image-caption", with: image.caption)
        expect(page).to have_css(".image-existing img[src*='#{image_content_path(image, width: 250)}']")
      end
    end

    it "can display thumbnails for thing image list" do
      visit_thing thing

      within("sd-thing-editor .thing-form ul.thing-images") do
        expect(page).to have_css("li", count: thing.thing_images.count, wait: 10)
        img = find(".image_id", text: image.id, visible: false).find(:xpath, "..")

        within(img) do
          expect(page).to have_css("a label", text: image_caption(image))
          expect(page).to have_css("img[src*='#{image_content_path(image, width: 50)}']")
        end
      end
    end
  end

  context "upload content" do
    include_context "db_clean_after"

    before(:each) do
      login organizer
      visit_images
    end

    it "can select file" do
      within("sd-image-editor .image-form") do
        expect(page).to_not have_css(".image-existing img")
        attach_file("image-file", image_filepath)
        expect(page).to_not have_field("image-file")
        expect(page).to have_css("sd-image-editor .image-select img.image-preview")
      end
    end

    it "requires image content to create" do
      expect(page).to have_button("Create Image", disabled: true)
    end

    it "rejects file too big" do
      path = create_large_file ImageContent::MAX_CONTENT_SIZE

      within("sd-image-editor .image-form") do
        attach_file("image-file", path)

        expect(page).to have_button("Create Image", disabled: true)
        expect(page).to have_css(".image-select span.invalid", text: "image size is too large")
        expect(page).to have_css(".image-select img.image-preview")
      end
    end

    it "can upload file" do
      within("sd-image-editor .image-form") do
        attach_file("image-file", image_filepath )
        fill_in("image-caption", with: image_props[:caption])

        if (page.has_css?("span.invalid", text: /.+/))
          fail(page.find("span.invalid", text: /.+/).text)
        end

        using_wait_time 10 do
          click_button("Create Image")
        end
      end

      using_wait_time 10 do
        expect(page).to have_no_css("span.invalid", text: /.+/)
        expect(page).to have_no_css(".image-select img.image-preview")
        expect(page).to have_css(".image-existing img[src*='content?width=250']")
      end

      visit_images
      within(find(".image-list a", text: /^#{image_props[:caption]}/)) do
        expect(page).to have_css("img[src*='content?width=50']")
      end
    end

    it "can clear selected file" do
      within("sd-image-editor .image-form") do
        attach_file("image-file", image_filepath)
        expect(page).to have_css(".image-select img.image-preview")

        click_button("Clear Image")

        expect(page).to have_no_css(".image-select img.image-preview")
        expect(page).to have_field("image-file")
        expect(page).to have_no_button("Clear Image")
      end
    end
  end

  context "edit image content" do
    include_context "db_clean_after"

    before(:each) do
      login organizer
      visit_images
    end

    it "shows original and preview image" do
      within("sd-image-editor .image-form") do
        attach_file("image-file", image_filepath )
        expect(page).to have_css(".image-select img.image-preview")
        expect(page).to have_css(".image-select .crop-area canvas")
      end
    end

    it "can crop image" do
      existing_content = ImageContent.pluck(:_id)

      within("sd-image-editor .image-form") do
        attach_file("image-file", image_filepath)
        fill_in("image-caption", with: image_props[:caption])
        expect(page).to have_css(".image-select img.image-preview", wait: 5)
        expect(page).to have_button("Create Image", disabled: false)
        click_button("Create Image")
      end

      using_wait_time 15 do
        expect(page).to have_no_button("Create Image", disabled: false)
        expect(page).to have_no_css(".image-select img.image-preview")
        expect(page).to have_css(".image-existing img[src*='content?width=250']")
      end

      contents = ImageContent.where(original: true).not.in(_id: existing_content)
      expect(contents.size).to eq(1)
      content = contents.first
      ratio = content.width.to_f / content.height.to_f
      expect(ratio.round(1)).to eq(1.5)
    end
  end
end
