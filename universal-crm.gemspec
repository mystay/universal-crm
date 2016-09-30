$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "universal-crm/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "universal-crm"
  s.version     = UniversalCrm::VERSION
  s.authors     = ["Ben Petro"]
  s.email       = ["ben@bthree.com.au"]
  s.homepage    = "TODO"
  s.summary     = "TODO: Summary of Crm."
  s.description = "TODO: Description of Crm."
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency 'rails', '~> 4.2.7'
  s.add_dependency 'mongoid', '~> 4.0.0'
  s.add_dependency 'haml', '~> 4.0.5'
  s.add_dependency 'universal'
  s.add_dependency 'react-rails'
  s.add_dependency 'bootstrap-sass'
  s.add_dependency 'carrierwave'
  s.add_dependency 'carrierwave-mongoid'
  
end
