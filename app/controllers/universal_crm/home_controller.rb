require_dependency "universal_crm/application_controller"

module UniversalCrm
  class HomeController < ApplicationController
    include UniversalCrm::Concerns::InboundMail
    
    skip_before_filter :require_user, only: %w(inbound)
    
  end
end
