require_dependency "universal_crm/application_controller"

module UniversalCrm
  class ConfigController < ApplicationController
    
    def show
      render json: universal_config.to_json
    end
    
  end
end