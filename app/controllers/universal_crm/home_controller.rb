require_dependency "universal_crm/application_controller"

module UniversalCrm
  class HomeController < ApplicationController
    
    skip_before_filter :require_user, only: %w(inbound)
    protect_from_forgery except: %w(inbound)
    
    def index
      #list all tickets  
    end
    
    def inbound
      #find the email address we're sending to
      to = params['ToFull'][0]['Email'] if !params['ToFull'].blank?
      cc = params['CcFull'][0]['Email'] if !params['CcFull'].blank?
      bcc = params['BccFull'][0]['Email'] if !params['BccFull'].blank?
      if !to.blank? and to.include?(UniversalCrm::Configuration.inbound_postmark_email_address)
        to = to
      elsif !cc.blank? and cc.include?(UniversalCrm::Configuration.inbound_postmark_email_address)
        to = cc
      elsif !bcc.blank? and bcc.include?(UniversalCrm::Configuration.inbound_postmark_email_address)
        to = bcc
      end
      
      #parse the email, and create a ticket where necessary:
      if !to.blank? and !params['From'].blank?
        if !Universal::Configuration.class_name_user.blank?
          sender = Universal::Configuration.class_name_user.classify.constantize.find_by(email: params['From'])
        end
        token = to[3,to.index('@')-3]
        if to[0,3]=='cr-'
          subject = UniversalCrm::Customer.find_by(token: token)
          if !subject.nil?
            subject.tickets.create kind: :email, title: params['Subject'], content: params['TextBody'], scope: subject.scope, responsible: sender
          end
        elsif to[0,3] == 'tk-'
          subject = UniversalCrm::Ticket.find_by(token: token)
          if !subject.nil?
            subject.comments.create content: params['TextBody'], user: sender, kind: :email
          end
        else #we may be sending directly to an inbound adress of an existing customer:
          subject = UniversalCrm::Customer.find_by(email: to)
          if !subject.nil?
            subject.tickets.create kind: :email, title: params['Subject'], content: params['TextBody'], scope: subject.scope
          end
        end
      end
      render json: {}
    end
    
  end
end
