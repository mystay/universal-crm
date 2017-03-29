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
              id: universal_user.id.to_s,
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
          logger.info params
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

          #parse the email, and create a ticket where necessary:
          if !to.blank? and !from.blank?
            logger.warn "To: #{to}"
            ticket=nil
            #find the senders first, there could be multiple across different scope, if the user config is scoped
            if !Universal::Configuration.class_name_user.blank?
              if Universal::Configuration.user_scoped
                senders = Universal::Configuration.class_name_user.classify.constantize.where(email: /^#{from}$/i)
              else #user is not scoped - easy
                sender = Universal::Configuration.class_name_user.classify.constantize.find_by(email: /^#{from}$/i)
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
            if !config.nil?#we are sending to our general scope
              logger.warn "Direct to config"
              #we probably have to create a new customer
              if !sender.nil?
                customer = UniversalCrm::Customer.find_by(subject: sender)
              end
              customer ||= UniversalCrm::Customer.find_by(scope: config.scope, email: /^#{from}$/i)
              customer ||= UniversalCrm::Customer.create(scope: config.scope, email: from)
              if customer.active?
                customer.update(name: params['FromName']) if customer.name.blank?
                ticket = customer.tickets.create  kind: :email,
                                                  title: params['Subject'],
                                                  content: params['TextBody'].hideQuotedLines,
                                                  html_body: params['HtmlBody'].hideQuotedLines,
                                                  scope: config.scope,
                                                  to_email: to,
                                                  from_email: from

                #Send this ticket to the customer now, so they can reply to it
                #If it WASN'T sent to one of our inboud addresses that is:
                if !config.inbound_email_addresses.include?(to)
                  UniversalCrm::Mailer.new_ticket(config, customer, ticket, false).deliver_now
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
                                          from_email: from
                  logger.warn ticket.errors.to_json
                end
              elsif to[0,3] == 'tk-'
                logger.warn "Direct to ticket"
                ticket = UniversalCrm::Ticket.find_by(token: /^#{token}$/i)
                customer = ticket.subject
                user = (customer.subject.class.to_s == Universal::Configuration.class_name_user.to_s ? customer.subject : nil),
                if !ticket.nil?
                  ticket.open!(user)
                  ticket.update(kind: :email)
                  comment = ticket.comments.create content: params['TextBody'].hideQuotedLines,
                                          html_body: params['HtmlBody'].hideQuotedLines,
                                          user: user,
                                          kind: :email,
                                          when: Time.now.utc,
                                          author: (customer.nil? ? 'Unknown' : customer.name),
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
                                                  from_email: from
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
        end
        
        def unload
          remove_tickets_viewing!
          render json: {}
        end
        
        def dashboard
          @tickets = UniversalCrm::Ticket.unscoped
          @tickets = @tickets.scoped_to(universal_scope) if !universal_scope.nil?
          map = %Q{
            function(){
              emit({status: this._s, kind: this._kn}, 1);
            }
          }
          map_flags = %Q{
            function(){
              if (this._fgs){
                this._fgs.forEach(function(flag){
                  emit(flag, 1);
                });
              }
            }
          }
          reduce = %Q{
            function(key, values){
              var count = 0;
              values.forEach(function(value){
                count += parseInt(value);
              });
              return count;
            }
          }
          status_count = @tickets.map_reduce(map, reduce).out(inline: true)
          flag_count = @tickets.map_reduce(map_flags, reduce).out(inline: true)
          flags = {}
          flag_count.sort_by{|a| -a['value'].to_i}.each do |c|
            flags.merge!(c['_id'] => c['value'])  
          end
          render json: {
            ticket_counts: {
              inbox: status_count.select{|s| s['_id']['kind']=='email' && s['_id']['status'] == 'active'}.map{|s| s['value'].to_i}.sum,
              open: status_count.select{|s| s['_id']['status'] == 'active'}.map{|s| s['value'].to_i}.sum,
              actioned: status_count.select{|s| s['_id']['status'] == 'actioned'}.map{|s| s['value'].to_i}.sum,
              closed: status_count.select{|s| s['_id']['status'] == 'closed'}.map{|s| s['value'].to_i}.sum
              },
            flags: flags,
            totalFlags:  flags.to_a.map{|a| a[1].to_i}.sum
          }
        end
      end
    end
  end
end