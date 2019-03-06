module UniversalCrm
  class Comment
    include Mongoid::Document
    include Mongoid::Timestamps
    include HmsCore::Concerns::Polymorphic
    include HmsCore::Concerns::Kind
    include HmsCore::Concerns::Status
    
    include HmsCore::Concerns::UniversalScoped
    include HmsCore::Concerns::UniversalHasAttachments

    store_in collection: 'comments'

    field :a, as: :author
    field :c, as: :content
    field :hb, as: :html_body
    field :w, as: :when, type: DateTime
    field :sg, as: :system_generated, type: Boolean, default: false
    field :ic, as: :incoming, type: Boolean, default: false
    field :sn, as: :subject_name
    field :sk, as: :subject_kind

    default_scope ->(){order_by(when: :asc, id: :asc)}
    scope :not_system_generated, ->(){where(system_generated: false)}
    scope :system_generated, ->(){where(system_generated: true)}

    kinds %w(normal system email), :normal

    belongs_to :user, class_name: 'Padlock::User', foreign_key: :user_id

    def to_json
      {
        id: self.id.to_s,
        kind: self.kind.to_s,
        author: (self.user.nil? ? self.author : self.user.name),
        content: self.content.html_safe,
        html_body: self.html_body.html_safe,
        when: self.when,
        created_at: self.created_at.strftime('%b %d, %Y, %l:%M%P'),
        when_formatted: self.when.strftime('%b %d, %Y, %l:%M%P'),
        system_generated: self.system_generated,
        incoming: self.incoming,
        scope_type: self.scope_type,
        scope_id: self.scope_id.to_s,
        subject_type: self.subject_type,
        subject_id: self.subject_id.to_s,
        subject_name: self.subject_name,
        subject_kind: self.subject_kind,
        attachments: self.attachments.map{|a| {name: a.name, url: a.file.url, filename: a.file_filename}}
    }
    end

  end

end
