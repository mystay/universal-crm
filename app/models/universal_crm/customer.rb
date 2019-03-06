module UniversalCrm
  class Customer

    include Mongoid::Document
    include Mongoid::Timestamps
    include Mongoid::Search
    include HmsCore::Concerns::Status
    include HmsCore::Concerns::Kind
    include HmsCore::Concerns::Taggable
    include HmsCore::Concerns::Flaggable
    include HmsCore::Concerns::Polymorphic
    include HmsCore::Concerns::Commentable
    include HmsCore::Concerns::Tokened
    
    include HmsCore::Concerns::UniversalHasAttachments
    include HmsCore::Concerns::UniversalEmployee
    include HmsCore::Concerns::UniversalScoped
    include HmsCore::Concerns::UniversalNumbered

    store_in collection: 'crm_customers'

    field :n, as: :name
    field :p, as: :position
    field :e, as: :email
    field :ph, as: :phone_home
    field :pw, as: :phone_work
    field :pm, as: :phone_mobile

    has_many :tickets, as: :subject, class_name: 'UniversalCrm::Ticket'
    employed_by [{companies: 'UniversalCrm::Company'}]

    statuses %w(active draft blocked), default: :active

    search_in :n, :e

    validates :email, presence: true
    validates_uniqueness_of :email, scope: [:scope_type, :scope_id]
    # default_scope ->(){order_by(created_at: :desc)}

    def inbound_email_address(config)
      "cr-#{self.token}@#{config.inbound_domain}"
    end

    # Look through our user model, and see if we can find someone with the same email address,
    # and if so, assign them as the subject of this customer
    def assign_user_subject!(scope=nil)
      return if subject
      user = Padlock::User.find_by(email: self.email)
      self.update(subject: user, kind: :user) if !user.nil?
    end

    def to_json(config)
      return {
        id: self.id.to_s,
        status: self.status,
        number: self.number.to_s,
        name: self.name,
        position: self.position,
        email: self.email,
        phone_home: self.phone_home,
        phone_work: self.phone_work,
        phone_mobile: self.phone_mobile,
        tags: self.tags,
        flags: self.flags,
        ticket_count: self.tickets.count,
        token: self.token,
        inbound_email_address: self.inbound_email_address(config),
        closed_ticket_count: self.tickets.unscoped.closed.count,
        companies: self.companies.map{|c| c.to_json(config)},
        subject_type: self.subject_type,
        subject_id: self.subject_id.to_s,
        created_at: self.created_at
        }
    end

    def block!(user)
      self.comments.create content: 'Customer blocked', author: user.name, when: Time.now.utc
      self.blocked!
    end

    def unblock!(user)
      self.comments.create content: 'Customer unblocked', author: user.name, when: Time.now.utc
      self.active!
    end

  end

end
