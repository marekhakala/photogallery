class ThingTag < ActiveRecord::Base
  belongs_to :tag
  belongs_to :thing
  
  validates :tag_id, :thing_id, presence: true

  scope :with_name, -> { joins(:tag).select("thing_tags.*, tags.name AS tag_name") }
end
