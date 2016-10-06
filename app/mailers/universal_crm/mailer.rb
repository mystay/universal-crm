module UniversalCrm
  class Mailer < ActionMailer::Base
  
    def new_ticket(config, customer, ticket, sent_from_crm=true)
      if !config.transaction_email_address.blank?
        @customer = customer
        @ticket = ticket
        @config = config
        @sent_from_crm = sent_from_crm
        mail  to: @customer.email,
              from: "#{config.transaction_email_from} <#{config.transaction_email_address}>",
              reply_to: ticket.inbound_email_address(config),
              subject: "#{ticket.title}"
      end
    end

    def ticket_reply(config, customer, ticket, comment)
      if !config.transaction_email_address.blank?
        @customer = customer
        @ticket = ticket
        @comment = comment
        @config = config
        if !@customer.nil?
          mail  to: @customer.email,
                from: "#{config.transaction_email_from} <#{config.transaction_email_address}>",
                reply_to: ticket.inbound_email_address(config),
                subject: "#{ticket.title}"
        end
      end
    end
  end
end
