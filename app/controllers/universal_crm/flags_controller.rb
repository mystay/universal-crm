require_dependency "universal_crm/application_controller"

module UniversalCrm
  class FlagsController < ApplicationController
    
    before_filter :find_subject
    
    def toggle
      if @subject.flagged_with?(params[:flag])
        @add = false
        @subject.remove_flag!(params[:flag])
        @subject.save_comment!("Removed label: '#{params[:flag]}'", universal_user, universal_scope)
      else
        @add = true
        @subject.flag!(params[:flag], universal_user)
        @subject.save_comment!("Added label: '#{params[:flag]}'", universal_user, universal_scope)
      end
      render json: {flags: @subject.flags}
    end
    
    private
    def find_subject
      if !params[:subject_type].blank? and params[:subject_type] != 'undefined' and !params[:subject_id].blank? and params[:subject_id] != 'undefined'
        @subject = params[:subject_type].classify.constantize.find(params[:subject_id])
      end      
    end
    
  end
end