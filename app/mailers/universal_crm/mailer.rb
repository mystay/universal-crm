module UniversalCrm
  class Mailer < ActionMailer::Base
  
    def new_ticket(config, customer, ticket)
      @customer = customer
      @ticket = ticket
      mail  to: 'bpetro@feet.shoes',#@customer.email,
            from: config.transaction_email_address,
            reply_to: ticket.inbound_email_address(config),
            subject: "Ticket Raised ##{ticket.number}"

    end

    def ticket_reply(config, customer, ticket, comment)
      @customer = customer
      @ticket = ticket
      @comment = comment
      mail  to: 'bpetro@feet.shoes',#@customer.email,
            from: config.transaction_email_address,
            reply_to: ticket.inbound_email_address(config),
            subject: "Ticket ##{ticket.number} - New reply"

    end
  end
end
