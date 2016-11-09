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
      if @attachment.shortened_url.blank?
        if !params[:google_api_key].blank?
          r = HTTParty.post("https://www.googleapis.com/urlshortener/v1/url",
              query: {key: params[:google_api_key]},
              body: {longUrl: @attachment.file.url}.to_json,
              headers: {'Content-Type' => 'application/json'})
          json = JSON.parse(r.body)
          puts json
          if !json['id'].blank?
            @attachment.update(shortened_url: json['id'])
            render json: {url: json['id']}
          else
            render json: {}
          end
        else
          render json: {}
        end
      else
        render json: {url: @attachment.shortened_url}
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