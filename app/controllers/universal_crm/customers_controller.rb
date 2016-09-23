require_dependency "universal_crm/application_controller"

module UniversalCrm
  class CustomersController < ApplicationController
    
    def index
      params[:page] = 1 if params[:page].blank?
      @customers = UniversalCrm::Customer.scoped_to(universal_scope)
      if !params[:q].blank?
        @customers = @customers.full_text_search(params[:q], match: :all)
      end
      @customers = @customers.page(params[:page])
      render json: {
        pagination: {
          total_count: @customers.total_count,
          page_count: @customers.total_pages,
          current_page: params[:page].to_i,
          per_page: 20
        },
        customers: @customers.map{|c| {id: c.id.to_s,
        number: c.number.to_s, name: c.name, email: c.email, ticket_count: c.tickets.not_closed.count}}
        }
    end
    
    def autocomplete
      @customers = UniversalCrm::Customer.all
      if !params[:term].blank?
        @customers = @customers.full_text_search(params[:term], match: :all)
      end
      json = @customers.map{|c| {label: c.name, value: c.id.to_s}}
      puts json
      render json: json.to_json
    end
    
    def show
      @customer = UniversalCrm::Customer.find(params[:id])
      if @customer.nil?
        render json: {customer: nil}
      else
        render json: {customer: {id: @customer.id.to_s, number: @customer.number.to_s, 
          name: @customer.name, email: @customer.email, 
          phone_home: @customer.phone_home,
          phone_work: @customer.phone_work,
          phone_mobile: @customer.phone_mobile,
          tags: @customer.tags,
          ticket_count: @customer.tickets.count,
          closed_ticket_count: @customer.tickets.unscoped.closed.count}}
      end
    end
    
    def update
      @customer = UniversalCrm::Customer.find(params[:id])
      @customer.update(params.require(:customer).permit(:name, :email, :phone_home, :phone_work, :phone_mobile))
      puts @customer.errors.to_json
      render json: {}
    end
    
  end
end