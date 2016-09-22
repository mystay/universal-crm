module UniversalCrm
  module Concerns
    module CrmCustomer
      extend ActiveSupport::Concern
      
      included do
        has_one :customer, class_name: 'Crm::Customer'
        
        before_save :build_customer
        
        private
        def build_customer
          if self.customer.nil?
            customer = ::Crm::Customer.new name: self.name, email: self.email
            customer.save
          end
        end
        
      end
      
    end
    
  end
end