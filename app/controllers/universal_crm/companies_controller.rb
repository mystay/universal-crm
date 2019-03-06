require_dependency "universal_crm/application_controller"

module UniversalCrm
  class CompaniesController < ApplicationController

    before_filter :find_company, only: %w(show update update_status add_employee)

    def recent
      @companies = UniversalCrm::Company.order_by(created_at: :desc).limit(8)
      @companies = @companies.scoped_to(universal_scope) if !universal_scope.nil?
      render json: {companies: @companies.map{|c| c.to_json(universal_crm_config)}}
    end

    def index
      params[:page] = 1 if params[:page].blank?
      @companies = UniversalCrm::Company.all
      @companies = @companies.scoped_to(universal_scope) if !universal_scope.nil?
      @companies = @companies.where(status: params[:status]) if !params[:status].blank?
      if !params[:country].blank?
        @companies = @companies.where(country_code: Basement::Country.find(params[:country]).code)
        if !params[:address_state].blank?
          @companies = @companies.where(address_state: params[:address_state])
        end
      end
      if !params[:q].blank?
        @companies = @companies.full_text_search(params[:q], match: :all)
      end
      @companies = @companies.order_by(name: :asc)
      @companies = @companies.page(params[:page])
      render json: {
        pagination: {
          total_count: defined?(WillPaginate) ? @companies.total_entries : @companies.total_count,
          page_count: @companies.total_pages,
          current_page: params[:page].to_i,
          per_page: 20
        },
        companies: @companies.map{|c| {id: c.id.to_s,
          number: c.number.to_s,
          name: c.name,
          email: c.email,
          token: c.token,
          status: c.status,
          tags: c.tags,
          ticket_count: c.tickets.not_closed.count,
          employee_ids: c.employee_ids.to_s,
          employees: c.employees_json,
          address: c.address
          }}
        }
    end

    def autocomplete
      @companies = UniversalCrm::Company.all
      @companies = @companies.scoped_to(universal_scope) if !universal_scope.nil?
      if !params[:term].blank?
        @companies = @companies.full_text_search(params[:term], match: :all)
      end
      json = @companies.map{|c| {label: [c.name, c.email].join(' - '), value: c.id.to_s}}
      render json: json.to_json
    end

    def show
      if @company.nil?
        render json: {company: nil}
      else
        respond_to do |format|
          format.html{}
          format.json{
            render json: {company: @company.to_json(universal_crm_config)}
          }
        end
      end
    end

    def create
      #make sure we don't have an existing customer
      @company = UniversalCrm::Company.find_by(scope: universal_scope, email: params[:email].strip.downcase)
      if @company.nil?
        @company = UniversalCrm::Company.create(scope: universal_scope, email: params[:email].strip.downcase, name: params[:name].strip, status: universal_crm_config.default_customer_status)
        #Check if we need to link this to a User model
        render json: {id: @company.id.to_s, name: @company.name, email: @company.email, existing: false}
      else
        render json: {id: @company.id.to_s, name: @company.name, email: @company.email, existing: @company.created_at<1.minute.ago}
      end
    end

    def update
      @company.update(params.require(:company).permit(:name, :email, :address_line_1, :address_line_2, :address_city, :address_state, :address_post_code, :country_id))
      render json: {company: @company.to_json(universal_crm_config)}
    end

    def update_status
      if params[:status] == 'blocked'
        @company.block!(universal_user)
      elsif params[:status] == 'active'
        @company.unblock!(universal_user)
      end
      render json: {customer: @customer.to_json(universal_crm_config)}
    end

    def add_employee
      employee = UniversalCrm::Customer.find(params[:customer_id])
      @company.add_employee!(employee)
      @company.subject.add_employee!(employee.subject) if employee.subject and @company.subject
      employee.active! if employee.draft?
      render json: {employees: @company.employees_json}
    end

    private
    def find_company
      @company = UniversalCrm::Company.find(params[:id])
    end

  end
end
