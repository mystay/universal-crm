var ExpandedTicket = React.createClass({
  
  render: function(){
    if (this.props.ticketId == this.props.ticket.id){
      return(
        <div>
          <p className='small'>
            Opened: {this.props.ticket.created_at} | Flagged: {this.props.ticket.flags.join(', ')}
          </p>
          <div className="well well-sm">
            <TicketFunctions
              status={this.props.status}
              flags={this.props.ticket.flags}
              priorityTicket={this.props.priorityTicket}
              changeTicketFlag={this.props.changeTicketFlag}
              changeTicketFlagPriority={this.props.changeTicketFlagPriority}
              changeTicketFlagNormal={this.props.changeTicketFlagNormal}
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
            />
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
  }
});