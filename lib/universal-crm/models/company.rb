module UniversalCrm
  module Models
    module Company
      extend ActiveSupport::Concern

      included do
        include Mongoid::Document
        include Mongoid::Timestamps
        include Mongoid::Search
        include Universal::Concerns::Status
        include Universal::Concerns::Kind
        include Universal::Concerns::Numbered
        include Universal::Concerns::Taggable
        include Universal::Concerns::Scoped
        
        store_in session: UniversalCrm::Configuration.mongoid_session_name, collection: 'crm_companies'

        field :n, as: :name
        field :e, as: :email
        field :p, as: :phone
        
        has_many :tickets, as: :subject, class_name: 'UniversalCrm::Ticket'
        has_many :customers, class_name: 'UniversalCrm::Customer'
        
        search_in :n, :e
        
        default_scope ->(){order_by(created_at: :desc)}
        
      end
    end
  end
end