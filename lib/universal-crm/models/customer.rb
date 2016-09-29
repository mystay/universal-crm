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
        include Universal::Concerns::Polymorphic
        include Universal::Concerns::Tokened
        
        store_in session: UniversalCrm::Configuration.mongoid_session_name, collection: 'crm_customers'

        field :n, as: :name
        field :e, as: :email
        field :ph, as: :phone_home
        field :pw, as: :phone_work
        field :pm, as: :phone_mobile
        
        has_many :tickets, as: :subject, class_name: 'UniversalCrm::Ticket'
        belongs_to :crm_company, class_name: 'UniversalCrm::Company'
        
        search_in :n, :e
        
        default_scope ->(){order_by(created_at: :desc)}
        
        def inbound_email_address(config)
          "cr-#{self.token}@#{config.inbound_domain}"
        end
        
        # Look through our user model, and see if we can find someone with the same email address,
        # and if so, assign them as the subject of this customer
        def assign_user_subject!(scope=nil)
          if !Universal::Configuration.class_name_user.blank? and self.subject.nil?
            user = Universal::Configuration.class_name_user.classify.constantize.find_by(scope: scope, email: self.email)
            self.update(subject: user, kind: :user) if !user.nil?
          end
        end
        
      end
    end
  end
end