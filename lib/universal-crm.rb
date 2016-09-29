require "universal-crm/engine"
require "universal-crm/configuration"
require "universal-crm/extensions"
Gem.find_files("universal-crm/models/*.rb").each { |path| require path }

module UniversalCrm
  
  Universal::Configuration.class_name_user = 'Padlock::User'
  
end
