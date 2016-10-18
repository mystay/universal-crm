module UniversalCrm
  class Engine < ::Rails::Engine
    isolate_namespace UniversalCrm
    
    initializer "universal-crm.assets.precompile" do |app|
      config.assets.precompile += ['*.png', '*.ico']
    end
    
  end
end
