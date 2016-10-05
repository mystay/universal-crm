module UniversalCrm
  module Concerns
    module InboundMail
      extend ActiveSupport::Concern
      
      included do
        protect_from_forgery except: %w(inbound)
        
        def index
          #list all tickets  
        end

        #we don't have universal scope here, so need to establish it from the to address or sender
        def inbound
          logger.warn "#### Inbound CRM mail received from #{params['From']}"
          logger.info params
          #find the email address we're sending to
          to = params['ToFull'][0]['Email'] if !params['ToFull'].blank?
          cc = params['CcFull'][0]['Email'] if !params['CcFull'].blank?
          bcc = params['BccFull'][0]['Email'] if !params['BccFull'].blank?

          #parse the email, and create a ticket where necessary:
          if !to.blank? and !params['From'].blank?
            logger.warn "To: #{to}"
            ticket=nil
            #find the senders first, there could be multiple across different scope, if the user config is scoped
            if !Universal::Configuration.class_name_user.blank?
              if UniversalCrm::Configuration.user_scoped
                senders = Universal::Configuration.class_name_user.classify.constantize.where(email: params['From'])
              else #user is not scoped - easy
                sender = Universal::Configuration.class_name_user.classify.constantize.find_by(email: params['From'])
              end
            end

            #check if we're sending to an inbound email address
            config = UniversalCrm::Config.find_by(inbound_email_addresses: to.downcase)
            if config.nil?
              #check if we're sending to a particular config/scope
              possible_token = to[0, to.index('@')]
              logger.info "possible_token: #{possible_token}"
              config = UniversalCrm::Config.find_by(token: possible_token)
            end
            if !config.nil?#we are sending to our general scope
              logger.warn "Direct to config"
              #we probably have to create a new customer
              if !sender.nil?
                customer = UniversalCrm::Customer.find_by(subject: sender)
              end
              customer ||= UniversalCrm::Customer.find_or_create_by(scope: config.scope, email: params['From'])
              customer.update(name: params['FromName']) if customer.name.blank?
              ticket = customer.tickets.create  kind: :email,
                                      title: params['Subject'],
                                      content: params['TextBody'].hideQuotedLines,
                                      scope: config.scope

              #Send this ticket to the customer now, so they can reply to it
              UniversalCrm::Mailer.new_ticket(config, customer, ticket, false).deliver_now
            else
              #find email addresses that match our config domains
              inbound_domains = UniversalCrm::Config.all.map{|c| c.inbound_domain}
              puts inbound_domains
              if !to.blank? and inbound_domains.include?(to[to.index('@')+1, to.length])
                to = to
              elsif !cc.blank? and inbound_domains.include?(cc[cc.index('@')+1, cc.length])
                to = cc
              elsif !bcc.blank? and inbound_domains.include?(bcc[bcc.index('@')+1, bcc.length])
                to = bcc
              end
              token = to[3, to.index('@')-3]
              puts token
              if to[0,3]=='cr-'
                logger.warn "Direct to customer"
                subject = UniversalCrm::Customer.find_by(token: token)
                if !subject.nil?
                  ticket = subject.tickets.create  kind: :email,
                                          title: params['Subject'],
                                          content: params['TextBody'].hideQuotedLines,
                                          scope: subject.scope,
                                          responsible: sender
                  logger.warn ticket.errors.to_json
                end
              elsif to[0,3] == 'tk-'
                logger.warn "Direct to ticket"
                ticket = UniversalCrm::Ticket.find_by(token: token)
                customer = ticket.subject
                user = (customer.subject.class.to_s == Universal::Configuration.class_name_user.to_s ? customer.subject : nil),
                if !ticket.nil?
                  ticket.open!(user)
                  comment = ticket.comments.create content: params['TextBody'].hideQuotedLines,
                                          user: user,
                                          kind: :email,
                                          when: Time.now.utc,
                                          author: (customer.nil? ? 'Unknown' : customer.name)
                  
                  logger.warn comment.errors.to_json
                end
              else #we may be sending directly to an inbound adress of an existing customer:
                logger.warn "Direct to customer's address - at our inbound domain"
                subject = UniversalCrm::Customer.find_by(email: to)
                if !subject.nil?
                  ticket = subject.tickets.create kind: :email, title: params['Subject'], content: params['TextBody'], scope: subject.scope
                  logger.warn ticket.errors.to_json
                end
              end
            end
            #check for attachments
            if !ticket.nil? and !params['Attachments'].blank? and !params['Attachments'].empty?
              params['Attachments'].each do |email_attachment|
                filename = email_attachment['Name']
                body = email_attachment['Content']
                path = "#{Rails.root}/tmp/attachments/#{Time.now.to_i}-#{filename}"
                File.open(path, 'wb'){|f| f.write(body)}
                att = ticket.attachments.create file: File.open(path), name: filename
                logger.warn att.errors.to_json
                File.delete(path)
              end              
            end
          else
            logger.warn "To not received"
          end
          render json: {}
        end
      end
    end
  end
end