module UniversalCrm
  module Concerns
    module CrmCompany
      extend ActiveSupport::Concern
      
      included do
        has_many :crm_companies, as: :subject, class_name: 'UniversalCrm::Company'

        def crm_company_name #can be overwritten in model
          self.name.to_s.strip
        end

        def crm_company_email #can be overwritten in model
          self.email.to_s.strip
        end
        
        def crm_company(scope, kind=nil)
          company = self.crm_companies.scoped_to(scope).first
          company ||= self.crm_companies.create scope: scope, name: self.crm_company_name, email: self.crm_company_email, kind: kind.to_s
          return company
        end
        
      end
      
    end
    
  end
end