require 'database_cleaner'

shared_context "db_cleanup" do |ar_strategy = :truncation|
  before(:all) do
    DatabaseCleaner[:mongoid].strategy = :truncation, { :except => %w(locations) }
    DatabaseCleaner[:active_record].strategy = ar_strategy
    DatabaseCleaner.clean_with(:truncation, { :except => %w(locations) })
  end

  after(:each, type: feature) { Capybara.reset_sessions! }
  after(:all) { DatabaseCleaner.clean_with(:truncation, { :except => %w(locations) }) }
end

shared_context "db_scope" do
  before(:each) { DatabaseCleaner.start }
  after(:each) { DatabaseCleaner.clean }
end

shared_context "db_clean_after" do
  after(:all) { DatabaseCleaner.clean_with(:truncation, { :except => %w(locations) }) }
end

shared_context "db_clean_all" do
  before(:all) { DatabaseCleaner.clean_with(:truncation, { :except => %w(locations) }) }
  after(:all) { DatabaseCleaner.clean_with(:truncation, { :except => %w(locations) }) }
end

shared_context "db_cleanup_each" do |ar_strategy = :truncation|
  before(:all) do
    DatabaseCleaner[:mongoid].strategy = :truncation, { :except => %w(locations) }
    DatabaseCleaner[:active_record].strategy = ar_strategy
    DatabaseCleaner.clean_with(:truncation, { :except => %w(locations) })
  end

  after(:all) { DatabaseCleaner.clean_with(:truncation, { :except => %w(locations) }) }
  before(:each) { DatabaseCleaner.start }

  after(:each) do
    Capybara.reset_sessions! if self.class.metadata[:js]
    DatabaseCleaner.clean
  end
end
