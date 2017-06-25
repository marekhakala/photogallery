class BarsController < ApplicationController
  before_action :set_bar, only: [:show, :update, :destroy]
  wrap_parameters :bar, include: ["name"]

  def index
    @bars = Bar.all
  end

  def show
  end

  def create
    @bar = Bar.new bar_params

    if @bar.save
      render :show, status: :created, location: @bar
    else
      render json: @bar.errors, status: :unprocessable_entity
    end
  end

  def update
    @bar = Bar.find params[:id]

    if @bar.update bar_params
      head :no_content
    else
      render json: @bar.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @bar.destroy
    head :no_content
  end

  private
    def set_bar
      @bar = Bar.find params[:id]
    end

    def bar_params
      params.require(:bar).permit(:name)
    end
end
