require "universal-crm/engine"
Gem.find_files("universal-crm/models/*.rb").each { |path| require path }

module Crm
  
  Universal::Configuration.class_name_user = 'Padlock::User'
  
end
