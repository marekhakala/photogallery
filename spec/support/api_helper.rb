module ApiHelper
  def parsed_body
    JSON.parse(response.body)
  end

  ["post", "put"].each do |http_method_name|
    define_method("j#{http_method_name}") do |path,params = {}, headers = {}|
      headers = headers.merge('content-type' => 'application/json') if !params.empty?
      self.send(http_method_name, path, params.to_json, headers)
    end
  end
end

RSpec.shared_examples "resource index" do |model|
  let!(:resources) { (1..5).map {|idx| FactoryGirl.create(model) } }
  let(:payload) { parsed_body }

  it "returns all #{model} instances" do
    get send("#{model}s_path"), {}, {"Accept"=>"application/json"}
    expect(response).to have_http_status(:ok)
    expect(response.content_type).to eq("application/json")

    expect(payload.count).to eq(resources.count)
    response_check if respond_to?(:response_check)
  end
end

RSpec.shared_examples "show resource" do |model|
  let(:resource) { FactoryGirl.create(model) }
  let(:payload) { parsed_body }
  let(:bad_id) { 1234567890 }

  it "returns Foo when using correct ID" do
    get send("#{model}_path", resource.id)
    expect(response).to have_http_status(:ok)
    expect(response.content_type).to eq("application/json")
    response_check if respond_to?(:response_check)
  end

  it "returns not found when using incorrect ID" do
    get send("#{model}_path", bad_id)
    expect(response).to have_http_status(:not_found)
    expect(response.content_type).to eq("application/json")

    payload = parsed_body
    expect(payload).to have_key("errors")
    expect(payload["errors"]).to have_key("full_messages")
    expect(payload["errors"]["full_messages"][0]).to include("cannot","#{bad_id}")
  end
end

RSpec.shared_examples "create resource" do |model|
  let(:resource_state) { FactoryGirl.attributes_for(model) }
  let(:payload) { parsed_body }
  let(:resource_id) { payload["id"] }

  it "can create valid #{model}" do
    jpost send("#{model}s_path"), resource_state
    expect(response).to have_http_status(:created)
    expect(response.content_type).to eq("application/json")

    expect(payload).to have_key("id")
    response_check if respond_to?(:response_check)

    get send("#{model}_path", resource_id)
    expect(response).to have_http_status(:ok)
  end
end

RSpec.shared_examples "modifiable resource" do |model|
  let(:resource) { resource = FactoryGirl.create(model) }
  let(:new_state) { FactoryGirl.attributes_for(model) }

  it "can update #{model}" do
    jput send("#{model}_path", resource.id), new_state
    expect(response).to have_http_status(:no_content)

    update_check if respond_to?(:update_check)
  end

  it "can be deleted" do
    head send("#{model}_path", resource.id)
    expect(response).to have_http_status(:ok)

    delete send("#{model}_path", resource.id)
    expect(response).to have_http_status(:no_content)

    head send("#{model}_path", resource.id)
    expect(response).to have_http_status(:not_found)
  end
end
