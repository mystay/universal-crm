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
              ticket={this.props.ticket}
              status={this.props.status}
              flags={this.props.ticket.flags}
              changeTicketFlag={this.props.changeTicketFlag}
              changeTicketStatusActive={this.props.changeTicketStatusActive}
              changeTicketStatusClosed={this.props.changeTicketStatusClosed}
              changeTicketStatusActioned={this.props.changeTicketStatusActioned}
              ticketFlags={this.props.ticketFlags}
              />
          </div>
          {this.actionedStatus()}
          {this.ticketNotes()}
          <Attachments subjectId={this.props.ticket.id} subjectType='UniversalCrm::Ticket' new={false} />
          <Comments 
            subject_type='UniversalCrm::Ticket'
            subject_id={this.props.ticket.id}
            countComments={this.props.countComments}
            newCommentPosition='bottom'
            openComments={this.ticketOpen()}
            newCommentPlaceholder={this.newCommentPlaceholder()}
            fullWidth={false}
            />
          {this.emailWarning()}
        </div>
      )
    }else{
      return(null);
    }
  },
  ticketNotes: function(){
    if (this.props.ticket.html_body){
      return(
        <blockquote>
          <div dangerouslySetInnerHTML={{__html: this.props.ticket.html_body}} />
        </blockquote>
      )
    }
    else if (this.props.ticket.content){
      return(
        <blockquote>
          <div dangerouslySetInnerHTML={{__html: this.props.ticket.content.replace(/(?:\r\n|\r|\n)/g, '<br />')}} />
        </blockquote>
      )
    }
  },
  ticketOpen: function(){
    return ((this.props.ticket.status == 'active' || this.actioned()) && (this.props.gs.config.inbound_email_addresses.indexOf(this.props.ticket.from_email)<0));
  },
  email: function(){
    return this.props.ticket.kind.toString() == 'email';
  },
  emailWarning: function(){
    if (this.email() && this.ticketOpen()){
      return(
        <div className="alert alert-warning alert-sm">
          <i className="fa fa-exclamation-triangle" /> <strong>Note:</strong> This reply will be emailed to: {this.props.ticket.subject_email}
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
  },
  actioned: function(){
    return(this.props.ticket.status == 'actioned');
  },
  actionedStatus: function(){
    if (this.actioned()){
      return(
        <div className="alert alert-success alert-sm text-center">
          <i className="fa fa-check" /> Actioned
        </div>
      );
    }
  }
});