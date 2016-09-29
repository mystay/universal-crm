module UniversalCrm
  module Models
    module Config
      extend ActiveSupport::Concern

      included do
        include Mongoid::Document
        include Universal::Concerns::Scoped
        include Universal::Concerns::Tokened
        
        store_in session: UniversalCrm::Configuration.mongoid_session_name, collection: 'crm_configs'

        field :tf, as: :ticket_flags, type: Array, default: [{label: 'priority', color: 'e25d5d'}, {label: 'general', color: '27b6af'}]
        field :hp, as: :hashed_password
        field :ibd, as: :inbound_domain
        field :sea, as: :transaction_email_address
        
        def to_json
          {
            scope_id: self.scope_id.to_s,
            ticketFlags: self.ticket_flags,
            hashed_password: self.hashed_password,
            inbound_domain: inbound_domain,
            transaction_email_address: transaction_email_address,
            token: self.token
          }
        end
        
      end
      
      module ClassMethods
        def find_by_scope(scope)
          return UniversalCrm::Config.find_or_create_by(scope: scope)
        end
      end
    end
  end
end