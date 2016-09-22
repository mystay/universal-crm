$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "crm/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "Universal CRM"
  s.version     = UniversalCrm::VERSION
  s.authors     = ["Ben Petro"]
  s.email       = ["ben@bthree.com.au"]
  s.homepage    = "TODO"
  s.summary     = "TODO: Summary of Crm."
  s.description = "TODO: Description of Crm."
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 4.2.0"
end
