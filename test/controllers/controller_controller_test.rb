require 'test_helper'

class ControllerControllerTest < ActionDispatch::IntegrationTest
  test "should get questions" do
    get controller_questions_url
    assert_response :success
  end

end
