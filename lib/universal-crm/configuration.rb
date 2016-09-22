module UniversalCrm
  class Configuration

    cattr_accessor :scope_class, :universal_scope

    def self.reset
      self.scope_class   = nil
      self.universal_scope = nil
    end

  end
end
UniversalCrm::Configuration.reset