class Thing < ActiveRecord::Base
  include Protectable
  has_many :thing_images, inverse_of: :thing, dependent: :destroy
  has_many :thing_tags, inverse_of: :thing, dependent: :destroy
  has_many :tags, through: :thing_tags

  validates :name, presence: true

  scope :name_only, -> { unscope(:select).select("things.id, name AS thing_name") }
  scope :with_tag, -> (tag) { where(id: ThingTag.select(:thing_id).where(tag: tag)) }
  scope :without_tag, -> (tag) { where.not(id: ThingTag.select(:thing_id).where(tag: tag)) }
  scope :not_linked, -> (image) { where.not(id: ThingImage.select(:thing_id).where(image: image)) }
end
