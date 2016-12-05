module UniversalCrm
  module Concerns
    module Ticketed
      extend ActiveSupport::Concern
      
      included do
        has_many :tickets, as: :document, class_name: 'UniversalCrm::Ticket'
        
        def crm_name #can be easily overridden in the model
          self.name
        end
        
        def open_ticket!(subject, document, title, content)
          ::UniversalCrm::Ticket.create title: title, content: content, subject: subject, document: document
        end
        
        def crm_secondary_scope
          #find the document that we want to secondarily scope this ticket to:
          if !UniversalCrm::Configuration.secondary_scope_class.blank?
            klass = UniversalCrm::Configuration.secondary_scope_class.classify.constantize
            foreign_key = "#{klass.to_s.demodulize.downcase}_id"
            return klass.find(self[foreign_key])
          end
        end
      end
      
    end
    
  end
end