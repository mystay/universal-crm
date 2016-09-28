var Ticket = React.createClass({
  getInitialState: function(){
    return ({
      commentCount: (this.props.ticket ? this.props.ticket.comment_count : 0)
    })
  },  
  setCustomerId: function(){
    this.props.setCustomerId(this.props.ticket.subject_id);
  },
  selectTicketId: function(e){
    this.props.setTicketId(e.target.id);
  },  
  countComments: function(e){
    this.setState({commentCount: e});
  },
  render: function(){
    if (this.props.ticket){
      return (
        <div className="panel panel-info">
          <div className="panel-heading">
            <h3 className="panel-title">
              Customer: {this.props.ticket.subject_name}
            </h3>
            <div className="actions pull-right">
              <i className="fa fa-times" onClick={this.props.closeTicket} />
            </div>
          </div>
          <div className="panel-body">
            <ExpandedTicket
              ticketId={this.props.ticket.id}
              ticket={this.props.ticket}
              status={this.props.ticket.status}
              changeTicketFlag={this.props.changeTicketFlag}
              changeTicketStatusActive={this.props.changeTicketStatusActive}
              changeTicketStatusClosed={this.props.changeTicketStatusClosed}
              countComments={this.countComments}
              ticketFlags={this.props.ticketFlags}
              />
          </div>
        </div>
      )
    }else{
      return(
        <div></div>
      )
    }
  }
});