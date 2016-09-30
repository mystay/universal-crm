module UniversalCrm
  module Models
    module Ticket
      extend ActiveSupport::Concern

      included do
        include Mongoid::Document
        include Mongoid::Timestamps
        include Mongoid::Search
        include Universal::Concerns::Status
        include Universal::Concerns::Kind
        include Universal::Concerns::Flaggable
        include Universal::Concerns::Taggable
        include Universal::Concerns::Polymorphic #the customer 
        include Universal::Concerns::Commentable
        include Universal::Concerns::Numbered
        include Universal::Concerns::Scoped
        include Universal::Concerns::Tokened
        include Universal::Concerns::HasAttachments
        
        store_in session: UniversalCrm::Configuration.mongoid_session_name, collection: 'crm_tickets'

        field :t, as: :title
        field :c, as: :content

        statuses %w(active closed), default: :active
        kinds %w(normal email), :normal

        flags %w(priority)

        belongs_to :document, polymorphic: true #the related document that this ticket should link to.
        belongs_to :responsible, class_name: Universal::Configuration.class_name_user, foreign_key: :responsible_id

        default_scope ->(){order_by(status: :asc, updated_at: :desc)}
        
        search_in :t
        
        def numbered_title
          [self.number, self.title].join(' - ')
        end
        
        def inbound_email_address(config)
          "tk-#{self.token}@#{config.inbound_domain}"
        end
        
        def close!(user)
          if self.active?
            self.save_comment!("Ticket Closed", user)
            self.closed!
          end
        end
        
        def open!(user=nil)
          if self.closed?
            self.save_comment!("Ticket Opened", user)
            self.active!
          end
        end
        
      end
      
      module ClassMethods
      end
      
    end
  end
end
