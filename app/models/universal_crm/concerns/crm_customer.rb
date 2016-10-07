module UniversalCrm
  module Concerns
    module CrmCustomer
      extend ActiveSupport::Concern
      
      included do
        has_many :crm_customers, as: :subject, class_name: 'UniversalCrm::Customer'

        def crm_customer_name #can be overwritten in model
          self.name.to_s.strip
        end

        def crm_customer_email #can be overwritten in model
          self.email.to_s.strip
        end
        
        #pass a company, to check if we're employed by them
        def crm_customer(scope, crm_company=nil, kind=nil)
          customer = self.crm_customers.scoped_to(scope).first
          customer ||= self.crm_customers.create scope: scope, name: self.crm_customer_name.st, email: self.crm_customer_email, kind: kind.to_s
          crm_company.add_employee!(customer) if !crm_company.nil?
          return customer
        end
        
      end
      
    end
    
  end
end