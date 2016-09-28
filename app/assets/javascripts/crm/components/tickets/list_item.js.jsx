var TicketListItem = React.createClass({
  getInitialState: function(){
    return ({
      commentCount: this.props.ticket.comment_count,
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
            closedLabel={this.closedLabel}
            selectTicketId={this.selectTicketId}
            config={this.props.config}
            />
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
          commentCount={this.state.commentCount}
          />
        <TicketCustomerName 
          setCustomerId={this.setCustomerId}
          name={this.props.ticket.subject_name}
          />
      </div>
    )
  },
  setCustomerId: function(){
    this.props.setCustomerId(this.props.ticket.subject_id);
  },
  selectTicketId: function(ticketId){
    this.props.setTicketId(ticketId);
  },    
  countComments: function(e){
    this.setState({commentCount: e});
  },
  ticketTitleClass: function(e){
    if (this.props.ticketId == e){
      return 'text-success'
    }
  },
  closedLabel: function(){
    if (this.props.ticket && this.props.ticket.status == 'closed'){
      return <span className='label label-default' style={{marginRight: '5px'}}>Closed</span>
    }
  }
});