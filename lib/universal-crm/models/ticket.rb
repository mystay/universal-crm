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
        include Universal::Concerns::Polymorphic #the customer (subject)
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
        field :url, as: :referring_url
        field :vids, as: :viewer_ids, type: Array, default: [] #an array of universal users who are viewing this ticket
        field :eids, as: :editor_ids, type: Array, default: [] #an array of universal users who are editing this ticket (replying)

        statuses %w(active actioned closed), default: :active
        kinds %w(normal email), :normal

        flags %w(priority)

        belongs_to :document, polymorphic: true #the related document that this ticket should link to.
        belongs_to :creator, class_name: Universal::Configuration.class_name_user, foreign_key: :creator_id
        belongs_to :responsible, class_name: Universal::Configuration.class_name_user, foreign_key: :responsible_id
        
        if !UniversalCrm::Configuration.secondary_scope_class.blank?
          belongs_to :secondary_scope, polymorphic: true
        end

        default_scope ->(){order_by(status: :asc, updated_at: :desc)}
        
        search_in :t, :c, :te, :fe
        
        def url(config)
          "#{config.url}/ticket/#{self.id}"
        end
        
        def name
          self.numbered_title  
        end
        
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
            self.save_comment!("Marked as Follow Up", user)
            self.actioned!
          end
        end
        
        #ticket sent from an external source to the CRM
        def incoming?
          !self.from_email.blank?
        end
        
        def document_name
          (self.document.nil? ? nil : self.document.crm_name)
        end
        
        def secondary_scope_name
          if !UniversalCrm::Configuration.secondary_scope_class.blank? and !self.secondary_scope_id.blank? and !self.secondary_scope.nil?
            return self.secondary_scope.crm_name
          end
        end
        
        def viewers
          Universal::Configuration.class_name_user.classify.constantize.in(id: self.viewer_ids)
        end
        
        def editors
          Universal::Configuration.class_name_user.classify.constantize.in(id: self.editor_ids)
        end
        
        def being_viewed_by!(user)
          self.push(viewer_ids: user.id.to_s) if !self.viewer_ids.include?(user.id.to_s)
        end
        
        def being_edited_by!(user)
          self.push(editor_ids: user.id.to_s) if !self.editor_ids.include?(user.id.to_s)
        end
        
        def not_viewed_by!(user)
          self.pull(viewer_ids: user.id.to_s)
        end
        
        def not_edited_by!(user)
          self.pull(editor_ids: user.id.to_s)
        end
        
        def to_json
          {
            id: self.id.to_s,
            number: self.number.to_s,
            numbered_title: self.numbered_title,
            status: self.status, 
            kind: self.kind.to_s,
            subject_name: self.subject.name,
            subject_id: self.subject_id.to_s,
            subject_email: (self.subject.nil? ? nil : self.subject.email),
            document_name: self.document_name,
            document_type: self.document_type,
            document_id: self.document_id.to_s,
            secondary_scope_name: self.secondary_scope_name,
            viewer_ids: self.viewer_ids,
            viewer_names: self.viewers.map{|v| v.name},
            editor_ids: self.editor_ids,
            editor_names: self.editors.map{|e| e.name},
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
            tags: self.tags,
            attachments: self.attachments.map{|a| {name: a.name, url: a.file.url, filename: a.file_filename}},
            incoming: self.incoming?,
            responsible_id: self.responsible_id.to_s,
            responsible_name: (self.responsible.nil? ? nil : self.responsible.name),
            referring_url: self.referring_url
          }
        end
        
      end
      
      module ClassMethods
      end
      
    end
  end
end
