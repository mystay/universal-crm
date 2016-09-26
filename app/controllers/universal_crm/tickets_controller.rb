require_dependency "universal_crm/application_controller"

module UniversalCrm
  class TicketsController < ::ApplicationController
    
    def index
      params[:page] = 1 if params[:page].blank?
      @tickets = UniversalCrm::Ticket.all
      @tickets = @tickets.scoped_to(universal_scope) if !universal_scope.nil?
      @tickets = @tickets.where(subject_id: params[:customer_id]) if !params[:customer_id].blank?
      if !params[:status].blank? and params[:status] != 'priority' and params[:status] != 'all'
        @tickets = @tickets.for_status(params[:status])
      elsif params[:status] == 'priority'
        @tickets = @tickets.active.priority
      elsif params[:status] != 'all'
        @tickets = @tickets.active  
      end
      @tickets = @tickets.page(params[:page])
      render json: {
        pagination: {
          total_count: @tickets.total_count,
          page_count: @tickets.total_pages,
          current_page: params[:page].to_i,
          per_page: 20
        },
        tickets: @tickets.map{|t| ticket(t)}
        }
    end
    
    def create
      subject = UniversalCrm::Customer.find params[:customer_id]
      ticket = subject.tickets.new title: params[:title], content: params[:content], scope: universal_scope, responsible: universal_user
      ticket.save
      render json: {}
    end
    
    def update_status
      @ticket = universal_scope.tickets.unscoped.find(params[:id])
      @ticket.update(status: params[:status])
      render json: {ticket: ticket(@ticket)}
    end
    
    def flag
      @ticket = universal_scope.tickets.find(params[:id])
      if params[:add] == 'true'
        @ticket.flag!(params[:flag], universal_user)
      else
        @ticket.remove_flag!(params[:flag])
      end
      render json: {ticket: ticket(@ticket)}
    end
    
    def ticket(t)
      {
        id: t.id.to_s, number: t.number.to_s, status: t.status, 
        subject_name: t.subject.name,
        subject_id: t.subject_id.to_s,
        title: t.title, content: t.content,
        updated_at: t.updated_at.strftime('%b %d, %Y, %l:%M%P'),
        created_at: t.created_at.strftime('%b %d, %Y, %l:%M%P'),
        comment_count: t.comments.count,
        flags: t.flags
      }
    end
  end
end
