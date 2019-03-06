module UniversalCrm
  module ApplicationHelper

    def icon(name, options=nil)
      "<i class=\"fa fa-lg fa-fw fa-#{name}\" #{options.nil? ? '' : options}></i>".html_safe
    end

    #######COMPONENTS
    def panel(attrs={}, &block)
      render layout: 'components/panel', locals: {attrs: attrs}{
        capture(&block)
      }
    end

    def table(attrs={}, &block)
      render layout: 'components/table', locals: {attrs: attrs}{
        capture(&block)
      }
    end

    def modal(attrs={}, &block)
      render layout: 'components/modal', locals: {attrs: attrs}{
        capture(&block)
      }
    end

    def tabs(attrs={}, &block)
      render layout: 'components/tabs', locals: {attrs: attrs}{
        capture(&block)
      }
    end

  end
end
