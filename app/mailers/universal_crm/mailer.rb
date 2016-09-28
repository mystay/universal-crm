
module UniversalCrm
  class Mailer < ActionMailer::Base
  
  def ticket_reply(customer, ticket, comment)
    @customer = customer
    @ticket = ticket
    @comment = comment
    mail  to: 'bpetro@feet.shoes',#@customer.email,
          from: "noreply@#{UniversalCrm::Configuration.inbound_postmark_email_address}",
          reply_to: ticket.inbound_email_address,
          subject: "Ticket ##{ticket.number} - New reply"
    
    end
  end
end
