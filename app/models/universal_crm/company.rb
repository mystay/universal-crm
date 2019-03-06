module UniversalCrm
  class Company
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
    include HmsCore::Concerns::Addressed
    
    include HmsCore::Concerns::UniversalNumbered
    include HmsCore::Concerns::UniversalScoped
    include HmsCore::Concerns::UniversalEmployer
    include HmsCore::Concerns::UniversalHasAttachments

    store_in collection: 'crm_companies'

    field :n, as: :name
    field :e, as: :email
    field :p, as: :phone

    has_many :tickets, as: :subject, class_name: 'UniversalCrm::Ticket'

    search_in :n, :e

    statuses %w(active draft blocked), default: :active

    validates :name, presence: true
    validates_uniqueness_of :email, allow_blank: true, scope: [:scope_type, :scope_id]
#         numbered_prefix 'CP'

    # default_scope ->(){order_by(created_at: :desc)}

    def inbound_email_address(config)
      "cp-#{self.token}@#{config.inbound_domain}"
    end

    def to_json(config)
      return {
        id: self.id.to_s,
        number: self.number.to_s,
        status: self.status,
        name: self.name,
        email: self.email,
        phone: self.phone,
        tags: self.tags,
        flags: self.flags,
        ticket_count: self.tickets.count,
        token: self.token,
        inbound_email_address: self.inbound_email_address(config),
        closed_ticket_count: self.tickets.unscoped.closed.count,
        employee_ids: self.employee_ids,
        employees: self.employees_json,
        address: self.address,
        subject_type: self.subject_type,
        subject_id: self.subject_id.to_s
        }
    end

    def employees_json
      a=[]
      self.employees.each do |e|
        a.push({
          id: e.id.to_s,
          name: e.name,
          email: e.email,
          type: e.class.to_s,
          open_ticket_count: e.tickets.active.count
          })
      end
      return a
    end

    def block!(user)
      self.comments.create content: 'Company blocked', author: user.name, when: Time.now.utc
      self.blocked!
    end

    def unblock!(user)
      self.comments.create content: 'Company unblocked', author: user.name, when: Time.now.utc
      self.active!
    end

  end
end
