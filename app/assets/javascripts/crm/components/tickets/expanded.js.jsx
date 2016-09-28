var ExpandedTicket = React.createClass({
  
  render: function(){
    if (this.props.ticketId == this.props.ticket.id){
      return(
        <div>
          <p className='small'>
            Opened: {this.props.ticket.created_at}
          </p>
          <div className="well well-sm">
            <TicketFunctions
              status={this.props.status}
              flags={this.props.ticket.flags}
              changeTicketFlag={this.props.changeTicketFlag}
              changeTicketStatusActive={this.props.changeTicketStatusActive}
              changeTicketStatusClosed={this.props.changeTicketStatusClosed}
              ticketFlags={this.props.ticketFlags}
              />
          </div>
          {this.ticketNotes()}
          <Comments 
            subject_type='UniversalCrm::Ticket'
            subject_id={this.props.ticket.id}
            countComments={this.props.countComments}
            newCommentPosition='bottom'
            status={this.props.status}
            newCommentPlaceholder={this.newCommentPlaceholder()}
            />
          {this.emailWarning()}
        </div>
      )
    }else{
      return(<div></div>)
    }
  },
  ticketNotes: function(){
    if (this.props.ticket.content){
      return(
        <blockquote>
          {nl2br(this.props.ticket.content)}
        </blockquote>
      )
    }
  },
  ticketOpen: function(){
    return (this.props.ticket.status == 'active');
  },
  email: function(){
    return this.props.ticket.kind.toString() == 'email';
  },
  emailWarning: function(){
    if (this.email() && this.ticketOpen()){
      return(
        <div className="alert alert-warning alert-sm">
          <i className="fa fa-exclamation-triangle" /> <strong>Note:</strong> This reply will be emailed to the customer
        </div>
      )
    }else{
      return(null)
    }
  },
  newCommentPlaceholder: function(){
    if (this.email()){
      return 'Reply...';
    }else{
      return 'New comment...';
    }
  }
});