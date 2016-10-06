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
        field :hb, as: :html_body
        field :te, as: :to_email
        field :fe, as: :from_email

        statuses %w(active actioned closed), default: :active
        kinds %w(normal email), :normal

        flags %w(priority)

        belongs_to :document, polymorphic: true #the related document that this ticket should link to.
        belongs_to :responsible, class_name: Universal::Configuration.class_name_user, foreign_key: :responsible_id

        default_scope ->(){order_by(status: :asc, updated_at: :desc)}
        
        search_in :t, :c, :te, :fe
        
        def numbered_title
          [self.number, self.title].join(' - ')
        end
        
        def inbound_email_address(config)
          "tk-#{self.token}@#{config.inbound_domain}"
        end
        
        def close!(user)
          if self.active? or self.actioned?
            self.save_comment!("Ticket Closed", user)
            self.closed!
          end
        end
        
        def open!(user=nil)
          if self.closed? or self.actioned?
            self.save_comment!("Ticket Opened", user)
            self.active!
          end
        end
        
        def action!(user=nil)
          if self.active?
            self.save_comment!("Ticket Actioned", user)
            self.actioned!
          end
        end
        
        #ticket sent from an external source to the CRM
        def incoming?
          !self.from_email.blank?
        end
        
        def to_json
          {
            id: self.id.to_s,
            number: self.number.to_s,
            status: self.status, 
            kind: self.kind.to_s,
            subject_name: self.subject.name,
            subject_id: self.subject_id.to_s,
            subject_email: self.subject.email,
            title: self.title,
            content: self.content,
            html_body: self.html_body,
            to_email: self.to_email,
            from_email: self.from_email,
            updated_at: self.updated_at.strftime('%b %d, %Y, %l:%M%P'),
            created_at: self.created_at.strftime('%b %d, %Y, %l:%M%P'),
            comment_count: self.comments.system_generated.count,
            reply_count: self.comments.not_system_generated.count,
            token: self.token,
            flags: self.flags,
            attachments: self.attachments.map{|a| {name: a.name, url: a.file.url, filename: a.file_filename}},
            incoming: self.incoming?
          }
        end
        
      end
      
      module ClassMethods
      end
      
    end
  end
end
