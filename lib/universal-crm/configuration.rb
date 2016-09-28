module UniversalCrm
  class Configuration

    cattr_accessor :scope_class, :mongoid_session_name, :inbound_postmark_email_address

    def self.reset
      self.scope_class                     = nil
      self.mongoid_session_name            = :default
      self.inbound_postmark_email_address  = nil
    end

  end
end
UniversalCrm::Configuration.reset