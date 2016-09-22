require_dependency "crm/application_controller"

module UniversalCrm
  class TicketsController < ApplicationController
    
    def index
      params[:page] = 1 if params[:page].blank?
      @tickets = UniversalCrm::Ticket.all
      @tickets = @tickets.where(subject_id: params[:customer_id]) if !params[:customer_id].blank?
      @tickets = @tickets.page(params[:page])
      render json:  {
        pagination: {
          total_count: @tickets.total_count,
          page_count: @tickets.total_pages,
          current_page: (params[:page] || 1),
          per_page: @tickets.length
        },
        tickets: @tickets.map{|c| {id: c.id.to_s, number: c.number.to_s, status: c.status,
        subject_id: t.subject_id,
        subject_name: t.subject.name, 
        title: c.title, content: c.content,
        updated_at: c.updated_at.strftime('%b %d, %Y, %l:%M%P'),
        comment_count: c.comments.count,
        flags: t.flags}}
        }
    end
    
    def create
      subject = UniversalCrm::Customer.find params[:customer_id]
      ticket = subject.tickets.new title: params[:title], content: params[:content]
      if !Universal::Configuration.class_name_user.blank?
        ticket.responsible = Universal::Configuration.class_name_user.classify.first
      end
      ticket.save
      render json: {}
    end
    
    def update_status
      @ticket = UniversalCrm::Ticket.find(params[:id])
      @ticket.update(status: params[:status])
      @ticket.save_comment!("Status updated to: #{params[:status]}")
      render json: {}
    end
    
    def flag
      @ticket = UniversalCrm::Ticket.find(params[:id])
      @ticket.flag!(params[:flag])
      @ticket.save_comment!("Flagged with: #{params[:flag]}")
      render json: {}
    end
    
  end
end
