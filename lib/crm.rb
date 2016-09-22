require "crm/engine"
Gem.find_files("crm/models/*.rb").each { |path| require path }

module Crm
  
  Universal::Configuration.class_name_user = 'Padlock::User'
  
end
