require_dependency "universal_crm/application_controller"

module UniversalCrm
  class CompaniesController < ApplicationController
    
    def recent
      @companies = UniversalCrm::Company.order_by(created_at: :desc).limit(8)
      @companies = @companies.scoped_to(universal_scope) if !universal_scope.nil?
      render json: {companies: @companies.map{|c| c.to_json(universal_crm_config)}}
    end
    
    def index
      params[:page] = 1 if params[:page].blank?
      @companies = UniversalCrm::Company.all
      @companies = @companies.scoped_to(universal_scope) if !universal_scope.nil?
      if !params[:q].blank?
        @companies = @companies.full_text_search(params[:q], match: :all)
      end
      @companies = @companies.page(params[:page])
      render json: {
        pagination: {
          total_count: @companies.total_count,
          page_count: @companies.total_pages,
          current_page: params[:page].to_i,
          per_page: 20
        },
        companies: @companies.map{|c| {id: c.id.to_s,
          number: c.number.to_s, 
          name: c.name, 
          email: c.email, 
          token: c.token,
          ticket_count: c.tickets.not_closed.count,
          employee_ids: c.employee_ids.to_s,
          employees: c.employees_json
          }}
        }
    end
    
    def autocomplete
      @companies = UniversalCrm::Company.all
      if !params[:term].blank?
        @companies = @companies.full_text_search(params[:term], match: :all)
      end
      json = @companies.map{|c| {label: c.name, value: c.id.to_s}}
      puts json
      render json: json.to_json
    end
    
    def show
      @company = UniversalCrm::Company.find(params[:id])
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
    
  end
end
