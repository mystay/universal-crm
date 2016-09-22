module UniversalCrm
  class ApplicationController < ::ApplicationController#ActionController::Base
    helper Universal::Engine::ApplicationHelper
    
    #need helper methods: universal_scope and universal_user
  end
end
