module UniversalCrm
  module Concerns
    module CrmCustomer
      extend ActiveSupport::Concern
      
      included do
        has_many :crm_customers, as: :subject, class_name: 'UniversalCrm::Customer'

        before_update :update_crm_customer
        
        def crm_customer_name #can be overwritten in model
          self.name.to_s.strip.titleize
        end

        def crm_customer_email #can be overwritten in model
          self.email.to_s.strip.downcase
        end
        
        #pass a company, to check if we're employed by them
        def crm_customer(scope, crm_company=nil, kind=nil)
          customer = self.crm_customers.scoped_to(scope).first
          if customer.nil?
            customer = UniversalCrm::Customer.find_by(scope: scope, email: self.crm_customer_email, kind: (kind.nil? ? nil : kind.to_s)) #check if a customer with this email already exists in the CRM
            customer.update(subject: self) if !customer.nil?
          end
          customer ||= self.crm_customers.create(scope: scope, name: self.crm_customer_name, email: self.crm_customer_email, kind: kind.to_s)
          customer.active! if customer.draft?
          crm_company.add_employee!(customer) if !crm_company.nil?
          return customer
        end
        
        def remove_from_company!(scope, crm_company)
          customer = self.crm_customers.scoped_to(scope).first
          crm_company.remove_employee!(customer) if !customer.nil?
        end
        
      end
      
      private
      def update_crm_customer
        if self.given_names_changed? or self.family_name_changed? or self.email_changed?
          #find the scope:
          self.crm_customers.each do |customer|
            customer.update(name: self.name.strip, email: self.email.strip.downcase)
          end
        end
      end
      
    end
    
  end
end