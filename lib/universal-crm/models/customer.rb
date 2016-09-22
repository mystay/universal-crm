module UniversalCrm
  module Models
    module Customer
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
        
        store_in session: UniversalCrm::Configuration.mongoid_session_name, collection: 'crm_customers'

        field :n, as: :name
        field :e, as: :email
        field :ph, as: :phone_home
        field :pw, as: :phone_work
        field :pm, as: :phone_mobile
        
        has_many :tickets, as: :subject, class_name: 'UniversalCrm::Ticket'
        belongs_to :company, class_name: 'UniversalCrm::Company'
        
        search_in :n, :e
        
        default_scope ->(){order_by(created_at: :desc)}
        
      end
    end
  end
end