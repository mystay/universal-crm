module UniversalCrm
  class Configuration

    cattr_accessor :scope_class, :user_scoped, :mongoid_session_name

    def self.reset
      self.scope_class                     = nil
      self.user_scoped                     = false
      self.mongoid_session_name            = :default
    end

  end
end
UniversalCrm::Configuration.reset