module UniversalCrm
  module Concerns
    module Home
      extend ActiveSupport::Concern
      
      included do
        protect_from_forgery except: %w(inbound)
        
        def index
          #list all tickets  
        end
        
        def init          
          users = Universal::Configuration.class_name_user.classify.constantize.where('_ugf.crm.0' => {'$exists' => true})
          users = users.sort_by{|a| a.name}.map{|u| {name: u.name, 
              email: u.email, 
              first_name: u.name.split(' ')[0].titleize, 
              id: u.id.to_s, 
              functions: (u.universal_user_group_functions.blank? ? [] : u.universal_user_group_functions['crm'])}}
          
          json = {config: universal_crm_config.to_json, users: users}

          if universal_user
            json.merge!({universal_user: {
              name: universal_user.name,
              email: universal_user.email,
              functions: (universal_user.universal_user_group_functions.blank? ? [] : universal_user.universal_user_group_functions['crm'])
            }})
          end
          render json: json
        end

        #we don't have universal scope here, so need to establish it from the to address or sender
        def inbound
          logger.warn "#### Inbound CRM mail received from #{params['From']}"
          # logger.info params
          if request.post? and !params['From'].blank? and !params['ToFull'].blank?
            #find the email address we're sending to
            to = params['ToFull'][0]['Email'].downcase if !params['ToFull'].blank? and !params['ToFull'][0].blank? and !params['ToFull'][0]['Email'].blank? and params['ToFull'][0]['Email'].include?('@')
            cc = params['CcFull'][0]['Email'].downcase if !params['CcFull'].blank? and !params['CcFull'][0].blank? and !params['CcFull'][0]['Email'].blank? and params['CcFull'][0]['Email'].include?('@')
            bcc = params['BccFull'][0]['Email'].downcase if !params['BccFull'].blank? and !params['BccFull'][0].blank? and !params['BccFull'][0]['Email'].blank? and params['BccFull'][0]['Email'].include?('@')
            from = params['From'].downcase
            if to.blank? and !cc.blank?
              to = cc
            elsif to.blank? and !bcc.blank?
              to = bcc
            end
            
            creator=nil
            from_name = params['FromName']
            forwarded_from = nil
            #Need to establish if this was a forwarded message, and find who it was originally from
            forwarded_match_regexp = /from:[\\n|\s]*(\b[\w|&|\s]*\b)?[\\n|\s|\<]*(\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b)\>/i
            s = params['TextBody']
            forwarded_message = s.match(forwarded_match_regexp)
            if !forwarded_message.nil?
              from_name = forwarded_message[1].to_s.strip
              forwarded_from = forwarded_message[2].to_s.downcase.strip
            end
  
            #parse the email, and create a ticket where necessary:
            if !to.blank? and !from.blank?
              logger.warn "To: #{to}"
              ticket=nil
              #find the senders first, there could be multiple across different scope, if the user config is scoped
              if !Universal::Configuration.class_name_user.blank?
                if Universal::Configuration.user_scoped #not using this yet...
                  # senders = Universal::Configuration.class_name_user.classify.constantize.where(email: /^#{forwarded_from||from}$/i)
                else #user is not scoped - easy
                  sender = Universal::Configuration.class_name_user.classify.constantize.find_by(email: /^#{forwarded_from||from}$/i)
                  creator = Universal::Configuration.class_name_user.classify.constantize.find_by(email: /^#{from}$/i)
                end
              end
  
              #check if we're sending to an inbound email address
              config = UniversalCrm::Config.find_by(inbound_email_addresses: to)
              if config.nil?
                #check if we're sending to a particular config/scope
                possible_token = to[0, to.index('@')]
                logger.info "possible_token: #{possible_token}"
                config = UniversalCrm::Config.find_by(token: possible_token)
              end
              if !config.nil? #we are sending to our scope
                logger.warn "Direct to config"
                #we probably have to create a new customer
                if !sender.nil?
                  ticket_subject = UniversalCrm::Customer.find_by(subject: sender)
                end
                ticket_subject ||= UniversalCrm::Customer.find_by(scope: config.scope, email: /^#{forwarded_from||from}$/i)
                ticket_subject ||= UniversalCrm::Company.find_by(scope: config.scope, email: /^#{forwarded_from||from}$/i) #check if there's a company now
                ticket_subject ||= UniversalCrm::Customer.create(scope: config.scope, email: (forwarded_from||from), status: :draft)
                if !ticket_subject.nil? and !ticket_subject.blocked?
                  ticket_subject.update(name: from_name) if ticket_subject.name.blank?
                  ticket = ticket_subject.tickets.create  kind: :email,
                                                    title: params['Subject'],
                                                    content: params['TextBody'].hideQuotedLines,
                                                    html_body: params['HtmlBody'].hideQuotedLines,
                                                    scope: config.scope,
                                                    to_email: to,
                                                    from_email: from,
                                                    creator: creator
  
                  #Send this ticket to the ticket_subject now, so they can reply to it
                  #If it WASN'T sent to one of our inboud addresses that is:
                  if !config.inbound_email_addresses.include?(to)
                    UniversalCrm::Mailer.new_ticket(config, ticket_subject, ticket, false).deliver_now
                  end
                end
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
                  subject = UniversalCrm::Customer.active.find_by(token: /^#{token}$/i)
                  if !subject.nil?
                    ticket = subject.tickets.create  kind: :email,
                                            title: params['Subject'],
                                            content: params['TextBody'].hideQuotedLines,
                                            html_body: params['HtmlBody'].hideQuotedLines,
                                            scope: subject.scope,
                                            responsible: sender,
                                            to_email: to,
                                            from_email: from,
                                            creator: creator
                    logger.warn ticket.errors.to_json
                  end
                elsif to[0,3] == 'tk-'
                  logger.warn "Direct to ticket"
                  ticket = UniversalCrm::Ticket.find_by(token: /^#{token}$/i)
                  ticket_subject = ticket.subject
                  user = (ticket_subject.subject.class.to_s == Universal::Configuration.class_name_user.to_s ? ticket_subject.subject : nil),
                  if !ticket.nil?
                    ticket.open!(user)
                    ticket.update(kind: :email)
                    comment = ticket.comments.create content: params['TextBody'].hideQuotedLines,
                                            html_body: params['HtmlBody'].hideQuotedLines,
                                            user: user,
                                            kind: :email,
                                            when: Time.now.utc,
                                            author: (ticket_subject.nil? ? 'Unknown' : ticket_subject.name),
                                            incoming: true
                    
                    logger.warn comment.errors.to_json
                  end
                else #we may be sending directly to an inbound adress of an existing customer:
                  logger.warn "Direct to customer's address - at our inbound domain"
                  subject = UniversalCrm::Customer.find_or_create_by(email: to)
                  if !subject.nil?
                    ticket = subject.tickets.create kind: :email,
                                                    title: params['Subject'],
                                                    content: params['TextBody'],
                                                    html_body: params['HtmlBody'],
                                                    scope: subject.scope,
                                                    to_email: to,
                                                    from_email: from,
                                                    creator: creator
                                                    
                    logger.warn ticket.errors.to_json
                  end
                end
              end
              #check for attachments
              if !ticket.nil? and !params['Attachments'].blank? and !params['Attachments'].empty?
                params['Attachments'].each do |email_attachment|
                  filename = email_attachment['Name']
                  body = email_attachment['Content']
  #                 puts body
                  begin
                    decoded = Base64.decode64(body.to_s)
  #                 puts decoded
                    path = "#{Rails.root}/tmp/attachments/#{Time.now.to_i}-#{filename}"
                    File.open(path, 'wb'){|f| f.write(decoded)}
                    att = ticket.attachments.create file: File.open(path), name: filename
                    logger.warn att.errors.to_json
                    File.delete(path)
                  rescue => error
                    puts "Attachment error: #{error.to_s}"
                  end
                end              
              end
            else
              logger.warn "To not received"
            end
            render json: {}
          else
            render json: {status: 200, message: "From/To not sent"}
          end
        end
      end
    end
  end
end