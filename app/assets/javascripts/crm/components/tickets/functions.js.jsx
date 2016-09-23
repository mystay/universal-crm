var TicketFunctions = React.createClass({
  render: function(){
    return(
      <div className="btn-group">
        {this.priorityButton()}
        {this.closeButton()}
      </div>
    )
  },
  priorityButton: function(){
    if (this.props.status != 'closed'){
      if (!this.props.priorityTicket()){
        return (
          <button className="btn btn-warning btn-xs" onClick={this.props.changeTicketFlagPriority}>
            <i className="fa fa-flag" /> Priority
          </button>
        )
      }else{
        return (
          <button className="btn btn-default btn-xs" onClick={this.props.changeTicketFlagNormal}>
            <i className="fa fa-ban" /> Not Priority
          </button>
        )
      }
    }
  },
  closeButton: function(){
    if (this.props.status == 'closed'){
      return (
          <button className="btn btn-info btn-xs" onClick={this.props.changeTicketStatusActive}>
            <i className="fa fa-check" /> Reopen
          </button>
      )
    }else{
      return (
          <button className="btn btn-success btn-xs" onClick={this.props.changeTicketStatusClosed}>
            <i className="fa fa-check" /> Close Ticket
          </button>
      )
    }
  }
});