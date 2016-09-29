module UniversalCrm
  class ApplicationController < ::ApplicationController#ActionController::Base
    helper Universal::Engine::ApplicationHelper
    
    #need helper methods: universal_scope and universal_user
    helper_method :universal_crm_config
    
    def universal_crm_config
      @universal_crm_config ||= UniversalCrm::Config.find_by_scope(universal_scope)
    end
    
  end
end
