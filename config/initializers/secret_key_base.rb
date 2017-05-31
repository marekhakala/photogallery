require 'securerandom'

def secret_key_base
  return ENV['SECRET_KEY_BASE'] if ENV.key? 'SECRET_KEY_BASE'
  secret_file = Rails.root.join('.secret')
  write_random_secret(secret_file) unless File.exist? secret_file
  File.read(secret_file).chomp
end

def write_random_secret file_path
  Rails.logger.info 'Generating new random secret key base'
  secret = SecureRandom.hex(64)
  File.write(file_path, secret)
  File.chmod(0400, file_path)
end

Rails.application.config.secret_key_base = secret_key_base
