require_dependency "universal/application_controller"

module Universal
  class CommentsController < Universal::ApplicationController
    before_filter :find_model

    def index
      @model = find_model
      render json: @model.comments.map{|c| {id: c.id.to_s, kind: c.kind.to_s, author: (c.user.nil? ? c.author : c.user.name), content: c.content, when: c.when}}
    end
    
    def create
      @model = find_model
      @comment = @model.comments.new content: params[:content]
      @comment.when = Time.now.utc
      @comment.user = current_user
      if @comment.save
        UniversalCrm::Mailer.ticket_reply(@model.subject, @model, @comment).deliver_now if @model.class == UniversalCrm::Ticket and @model.email?
        @model.touch
      else
        logger.debug @comment.errors.to_json
      end
      render json: @model.comments.map{|c| {id: c.id.to_s, author: (c.user.nil? ? c.author : c.user.name), content: c.content, when: c.when}}
    end

    private
    def find_model
      if params[:subject_type]
        return params[:subject_type].classify.constantize.unscoped.find params[:subject_id]
      end
      return nil
    end
    
  end
end