require_dependency "universal_crm/application_controller"

module UniversalCrm
  class TicketsController < ApplicationController
    
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
    
    def new
      
    end
    
    def create
      if !params[:customer_id].blank?
        subject = UniversalCrm::Customer.find params[:customer_id]
        kind = (params[:email].to_s == 'true' ? :email : :normal)
      elsif !params[:customer_name].blank? and !params[:customer_email].blank?
        #find a customer by this email
        subject = UniversalCrm::Customer.find_or_create_by(scope: universal_scope, email: params[:customer_email])
        subject.assign_user_subject!(universal_scope)
        kind = :email
      end
      if !params[:title].blank?
        ticket = subject.tickets.create kind: kind,
                                        title: params[:title],
                                        content: params[:content],
                                        scope: universal_scope,
                                        responsible: universal_user
        if ticket.valid? and ticket.email?
          #Send the contact form to the customer for their reference
          UniversalCrm::Mailer.new_ticket(universal_crm_config, subject, ticket, false).deliver_now
        end
      end
      render json: {}
    end
    
    def update_status
      @ticket = UniversalCrm::Ticket.find(params[:id])
      @ticket.update(status: params[:status])
      render json: {ticket: ticket(@ticket)}
    end
    
    def flag
      @ticket = UniversalCrm::Ticket.find(params[:id])
      if params[:add] == 'true'
        @ticket.flag!(params[:flag], universal_user)
        @ticket.save_comment!("Added flag: '#{params[:flag]}'", current_user)
      else
        @ticket.remove_flag!(params[:flag])
        @ticket.save_comment!("Removed flag: '#{params[:flag]}'", current_user)
      end
      render json: {ticket: ticket(@ticket)}
    end
    
    def ticket(t)
      {
        id: t.id.to_s, number: t.number.to_s, status: t.status, 
        kind: t.kind.to_s,
        subject_name: t.subject.name,
        subject_id: t.subject_id.to_s,
        title: t.title, content: t.content,
        updated_at: t.updated_at.strftime('%b %d, %Y, %l:%M%P'),
        created_at: t.created_at.strftime('%b %d, %Y, %l:%M%P'),
        comment_count: t.comments.count,
        token: t.token,
        flags: t.flags
      }
    end
  end
end
