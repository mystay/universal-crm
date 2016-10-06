require_dependency "universal/application_controller"

module Universal
  class CommentsController < ::UniversalCrm::ApplicationController
    before_filter :find_model

    def index
      @model = find_model
      render json: @model.comments.map{|c| {
        id: c.id.to_s,
        kind: c.kind.to_s,
        author: (c.user.nil? ? c.author : c.user.name),
        content: c.content.html_safe,
        html_body: c.html_body.html_safe,
        when: c.when,
        when_formatted: c.when.strftime('%b %d, %Y, %l:%M%P'),
        system_generated: c.system_generated,
        incoming: c.incoming
        }}
    end
    
    def create
      @model = find_model
      @comment = @model.comments.new content: params[:content]
      @comment.when = Time.now.utc
      @comment.user = current_user
      if @comment.save
        if @model.class == UniversalCrm::Ticket and @model.email?
          UniversalCrm::Mailer.ticket_reply(universal_crm_config, @model.subject, @model, @comment).deliver_now
        end
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