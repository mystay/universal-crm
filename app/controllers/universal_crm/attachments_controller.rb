require_dependency "universal_crm/application_controller"

module UniversalCrm
  class AttachmentsController < ApplicationController
    
    before_filter :find_subject
    
    def index
      if !@subject.nil?
        render json: {attachments: @subject.attachments.map{|a| a.to_json}}
      else
        render json: {attachments: []}  
      end
      
    end
    
    def create
      if !@subject.nil?
        attachments = []
        params[:files].each do |file|
          attachments.push(@subject.attachments.create file: file)
        end
        render json: {customer: @subject, attachments: attachments}
      else
        render json: {customer: nil}  
      end
    end
   
    private
    def find_subject
      if !params[:subject_type].blank? and !params[:subject_id].blank?
        @subject = params[:subject_type].classify.constantize.find(params[:subject_id])
      end      
    end
  end
end