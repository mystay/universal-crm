module UniversalCrm
  module Concerns
    module CrmCustomer
      extend ActiveSupport::Concern
      
      included do
        has_many :crm_customers, as: :subject, class_name: 'UniversalCrm::Customer'

        def crm_customer_name #can be overwritten in model
          self.name
        end

        def crm_customer_email #can be overwritten in model
          self.email
        end
        
        def crm_customer(scope, crm_company=nil, kind=nil)
          customers = self.crm_customers.scoped_to(scope)
          customers = customers.where(crm_company: crm_company) if !crm_company.nil?
          customer = customers.first
          customer ||= self.crm_customers.create scope: scope, crm_company: crm_company, name: self.crm_customer_name, email: self.crm_customer_email, kind: kind.to_s
          return customer
        end
        
      end
      
    end
    
  end
end