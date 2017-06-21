class ThingImagesController < ApplicationController
  include ActionController::Helpers
  helper ThingsHelper

  wrap_parameters :thing_image, include: ["image_id", "thing_id", "priority"]
  before_action :get_thing, only: [:index, :update, :destroy]
  before_action :get_image, only: [:image_things]
  before_action :get_thing_image, only: [:update, :destroy]
  before_action :authenticate_user!, only: [:create, :update, :destroy]

  after_action :verify_authorized, except: [:subjects]
  before_action :origin, only: [:subjects]

  def index
    authorize @thing, :get_images?
    @thing_images = @thing.thing_images.prioritized.with_caption
  end

  def image_things
    authorize @image, :get_things?
    @thing_images = @image.thing_images.prioritized.with_name
    render :index
  end

  def linkable_things
    authorize Thing, :get_linkables?
    image = Image.find(params[:image_id])
    @things = Thing.not_linked(image)
    @things = ThingPolicy::Scope.new(current_user,@things).user_roles(true, false)
    @things = ThingPolicy.merge(@things)
    render "things/index"
  end

  def subjects
    expires_in 1.minute, public: true
    miles = params[:miles] ? params[:miles].to_f : nil
    subject = params[:subject]
    distance = params[:distance] ||= "false"
    reverse = params[:order] && params[:order].downcase == "desc"
    last_modified = ThingImage.last_modified
    state = "#{request.headers['QUERY_STRING']}:#{last_modified}"
    eTag = "#{Digest::MD5.hexdigest(state)}"

    if stale? etag: eTag
      @thing_images = ThingImage.within_range(@origin, miles, reverse)
                                .with_name.with_caption.with_position
      @thing_images = @thing_images.things if subject && subject.downcase == "thing"
      @thing_images = ThingImage.with_distance(@origin, @thing_images) if distance.downcase == "true"

      render "thing_images/index"
    end
  end

  def create
    thing_image = ThingImage.new(thing_image_create_params.merge({ image_id: params[:image_id], thing_id: params[:thing_id] }))
    thing = Thing.where(id: thing_image.thing_id).first

    if !thing
      full_message_error "cannot find thing[#{params[:thing_id]}]", :bad_request
      skip_authorization
    elsif !Image.where(id: thing_image.image_id).exists?
      full_message_error "cannot find image[#{params[:image_id]}]", :bad_request
      skip_authorization
    else
      authorize thing, :add_image?
      thing_image.creator_id = current_user.id

      if thing_image.save
        head :no_content
      else
        render json: { errors: @thing_image.errors.messages }, status: :unprocessable_entity
      end
    end
  end

  def update
    authorize @thing, :update_image?

    if @thing_image.update thing_image_update_params
      head :no_content
    else
      render json: { errors: @thing_image.errors.messages }, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @thing, :remove_image?
    @thing_image.image.touch

    @thing_image.destroy
    head :no_content
  end

  private
    def get_thing
      @thing ||= Thing.find(params[:thing_id])
    end

    def get_image
      @image ||= Image.find(params[:image_id])
    end

    def get_thing_image
      @thing_image ||= ThingImage.find(params[:id])
    end

    def thing_image_create_params
      params.require(:thing_image).tap { |p|
        p.require(:image_id) if !params[:image_id]
        p.require(:thing_id) if !params[:thing_id]
      }.permit(:priority, :image_id, :thing_id)
    end

    def thing_image_update_params
      params.require(:thing_image).permit(:priority)
    end

    def origin
      case
      when params[:lng] && params[:lat]
        @origin = Point.new(params[:lng].to_f, params[:lat].to_f)
      else
        raise ActionController::ParameterMissing.new("an origin [lng/lat] required")
      end
    end
end
