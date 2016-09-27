var TicketTitleButton = React.createClass({
  selectTicket: function(){
    this.props.selectTicketId(this.props.ticket.id);
  },
  render: function(){
    if (this.props.ticket){
      return(
        <div
          onClick={this.selectTicket}
          style={{cursor: 'pointer', fontWeight: 'bold'}}>
          <div className='pull-right small hidden-xs'>Ticket: #{this.props.ticket.number}</div>
          {this.props.closedLabel()}
          {this.props.ticket.title}
          <Flags
            flags={this.props.ticket.flags}
            config={this.props.config}
            />
        </div>  
      )
    }else{
      return(<div></div>)   
    }
  }
});