require_dependency "universal_crm/application_controller"

module UniversalCrm
  class ConfigController < ApplicationController
    
    def show
      respond_to do |format|
        format.json{render json: universal_crm_config.to_json}
        format.html{}
      end
    end
    
    def update
      universal_crm_config.update(params.require(:config).permit(:system_name, :inbound_domain, :transaction_email_address, :transaction_email_from, :new_ticket_header, :new_reply_header, :email_footer))
      render json: universal_crm_config.to_json
    end
    
    def set_password
      password = params[:password]
      hashed_password = Digest::SHA1.hexdigest(password)
      universal_crm_config.update(hashed_password: hashed_password)
      universal_crm_config.reload
      render json: universal_crm_config.to_json
    end
    
    def signin
      password = params[:password]
      hashed_password = Digest::SHA1.hexdigest(password)
      render json: {signedIn: (universal_crm_config.hashed_password == hashed_password)}
    end
    
  end
end