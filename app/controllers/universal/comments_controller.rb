require_dependency "universal/application_controller"

module Universal
  class CommentsController < ::UniversalCrm::ApplicationController
    before_filter :find_model

    def index
      @model = find_model
      comments = load_comments
      render json: comments.map{|c| c.to_json}
    end
    
    def create
      @model = find_model
      @comment = @model.comments.new content: params[:content], kind: params[:kind]
      @comment.when = Time.now.utc
      @comment.user = current_user
      if @comment.save
        if @model.class == UniversalCrm::Ticket and @model.email? and @comment.email?
          UniversalCrm::Mailer.ticket_reply(universal_crm_config, @model.subject, @model, @comment).deliver_now
        end
        @model.touch
      else
        logger.debug @comment.errors.to_json
      end
      comments = load_comments
      render json: comments.map{|c| c.to_json}
    end

    private
    def find_model
      if params[:subject_type]
        return params[:subject_type].classify.constantize.unscoped.find params[:subject_id]
      end
      return nil
    end
    
    def load_comments
      comments = @model.comments
      if params[:hide_private_comments].to_s == 'true'
        comments = comments.not_system_generated.email 
      end
      return comments
    end
    
  end
end