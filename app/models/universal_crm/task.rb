module UniversalCrm
  class Task
    include Mongoid::Document
    include Mongoid::Timestamps
    include Mongoid::Search
    include HmsCore::Concerns::Status
    include HmsCore::Concerns::Kind
    include HmsCore::Concerns::Taggable
    include HmsCore::Concerns::Polymorphic
    include HmsCore::Concerns::Commentable
    
    include HmsCore::Concerns::UniversalScoped

    store_in collection: 'crm_tasks'

    field :an, as: :assignee_name
    field :t, as: :title
    field :n, as: :notes
    field :ca, as: :completed_at, type: DateTime
    field :d, as: :due_on, type: Date

    statuses %w(active complete)

    validates_presence_of :title, :subject

    search_in :title

    def overdue?
      !self.due_on.blank? and self.due_on < Time.zone.now
    end

end
end
