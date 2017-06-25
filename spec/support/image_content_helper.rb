module ImageContentHelper
  BASE_URL = "https://dev9.jhuep.com/fullstack-capstone"

  URL_PATH = "db/bta/skyline.jpg"
  IMAGE_PATH = "db/images/sample.jpg"

  def download_image
    image_url = "#{BASE_URL}/#{URL_PATH}"
    puts "downloading #{image_url} to #{IMAGE_PATH}"

    FileUtils::mkdir_p(File.dirname(IMAGE_PATH))
    source = open(image_url, { ssl_verify_mode: OpenSSL::SSL::VERIFY_NONE })
    IO.copy_stream(source, IMAGE_PATH)
  end

  def image_file
    download_image unless File.file?(IMAGE_PATH)
    File.new(IMAGE_PATH, "rb")
  end

  def self.sample_image_file
    download_image unless File.file?(IMAGE_PATH)
    File.new(IMAGE_PATH, "rb")
  end

  def self.sample_filepath
    download_image unless File.file?(IMAGE_PATH)
    "#{Rails.root}/#{IMAGE_PATH}"
  end

  def image_filepath
    ImageContentHelper.sample_filepath
  end

  def image_file
    ImageContentHelper.sample_image_file
  end

  def create_large_file min_size
    srcfile = image_file
    bigfile = File.open("tmp/bigfile.jpg", "wb")

    begin
      bigfile.write srcfile.read
      srcfile.rewind
    end while bigfile.size < min_size

    bigfile.close
    "#{Rails.root}/#{bigfile.path}"
  end
end
