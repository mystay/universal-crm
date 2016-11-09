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
        render json: {attachments: @subject.attachments.map{|a| a.to_json}}
      end
    end
    
    def shorten_url
      @attachment = @subject.attachments.find(params[:id])
      if !params[:google_api_key].blank?
        uri = URI.parse("https://www.googleapis.com/urlshortener/v1/url")
        r = HTTParty.post(uri,
            query: {key: params[:google_api_key]},
            body: {longUrl: @attachment.file.url},
            headers: { 'Content-Type' => 'application/json' })
        puts r
        render json: r.body
      else
        render json: {}
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