var TicketListItem = React.createClass({
  getInitialState: function(){
    return ({
      status: this.props.ticket.status,
      flags: this.props.ticket.flags
    })
  },
  render: function(){
    return (
      <div>
        <h4 className="list-group-item-heading">
          <TicketTitleButton 
            ticket={this.props.ticket}
            selectTicketId={this.selectTicketId}
            gs={this.props.gs} sgs={this.props.sgs}
          />
          <div style={{marginTop: '5px'}}><TicketStatus ticket={this.props.ticket} gs={this.props.gs} /></div>
        </h4>
        {this.listItemDetails()}
      </div>
    )
  },
  listItemDetails: function(){
    return(
      <div className="list-group-item-text">
        <TicketCommentsCreated 
          ticket={this.props.ticket}
          gs={this.props.gs} sgs={this.props.sgs}
        />
        {this.customerName()}
        {this.assignedTo()}
      </div>
    )
  },
  customerName: function(){
    if (this.props._goCustomer){
      return(
        <div>
          <TicketCustomerName
            _goCustomer={this.props._goCustomer}
            name={this.props.ticket.subject_name}
            id={this.props.ticket.subject_id}
          />
          {this.ticketSecondaryScope()}
        </div>
      );
    }else{
      return(<div>&nbsp;</div>);
    }
  },
  ticketSecondaryScope: function(){
    if (this.props.ticket.secondary_scope_name){
      return(
        <span> ({this.props.ticket.secondary_scope_name})</span>
      );
    }
  },
  selectTicketId: function(ticketId){
    this.props._goTicket(ticketId);
  },    
  countComments: function(e){
    this.setState({commentCount: e});
  },
  ticketTitleClass: function(e){
    if (this.props.ticketId == e){
      return 'text-success'
    }
  },
  assignedTo: function(){
    if (this.props.ticket.responsible_name){
      return(
        <span className="text-info" style={{marginLeft: '10px'}}>
          <i className="fa fa-chevron-right" /> {this.props.ticket.responsible_name}
        </span>
      );
    }
  }
});