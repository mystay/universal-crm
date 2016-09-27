module UniversalCrm
  class ApplicationController < ::ApplicationController#ActionController::Base
    helper Universal::Engine::ApplicationHelper
    
    #need helper methods: universal_scope and universal_user
    helper_method :universal_config
    
    def universal_config
      if @universal_config.nil?
        @configs = UniversalCrm::Config.all
        @configs = @configs.scoped_to(universal_scope) if !universal_scope.nil?
        @universal_config = @configs.first
      end
      @universal_config
    end
    
  end
end
