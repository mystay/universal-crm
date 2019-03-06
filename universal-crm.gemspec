$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "universal-crm/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "universal-crm"
  s.version     = UniversalCrm::VERSION
  s.authors     = ["Mystay International"]
  s.email       = ["dev@mystayinternational.com"]
  s.homepage    = ""
  s.summary     = "Summary of Crm."

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]

  s.add_dependency 'rails'
  s.add_dependency 'mongoid'
  s.add_dependency 'haml'
  s.add_dependency 'hms_core'
  s.add_dependency 'react-rails'
  s.add_dependency 'bootstrap-sass'
  s.add_dependency 'carrierwave'
  s.add_dependency 'carrierwave-mongoid'

end
