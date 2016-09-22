module UniversalCrm
  module Concerns
    module Customer
      extend ActiveSupport::Concern
      
      included do
        
        has_many :crm_customers, class_name: 'UniversalCrm::Customer'

        def crm_customer_name
          self.name
        end
        
        def new_customer!(scope, kind=nil)
          customer = self.crm_customers.scoped_to(scope).first
          customer ||= self.crm_customers.create scope: scope, name: self.crm_customer_name, email: self.email, kind: kind.to_s
          return customer
        end
        
      end
      
    end
    
  end
end