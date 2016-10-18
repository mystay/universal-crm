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
        
      end
      
    end
    
  end
end