require_relative '../support/image_content_helper.rb'

FactoryGirl.define do
  factory :image_content do
    content_type "image/jpg"

    sequence(:content) { |idx|
      File.open(ImageContentHelper.sample_filepath, "rb") { |f|
        image = StringIO.new f.read
        image = ImageContentCreator.annotate idx, image
        Base64.encode64 image
      }
    }
  end
end
