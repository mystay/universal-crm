var TicketTitleButton = React.createClass({
  selectTicket: function(){
    this.props.selectTicketId(this.props.ticket.id);
  },
  render: function(){
    if (this.props.ticket){
      return(
        <div onClick={this.selectTicket} style={{cursor: 'pointer', fontWeight: 'bold'}}>
          <div className='pull-right small hidden-xs'>Ticket: #{this.props.ticket.number}</div>
          {this.props.closedLabel()}
          {this.emailIcon()}
          {this.props.ticket.title}
          <Flags flags={this.props.ticket.flags} gs={this.props.gs} />
        </div>  
      )
    }else{
      return(null)   
    }
  },
  emailIcon: function(){
    if (this.props.ticket.kind.toString()=='email'){
      return(<i className="fa fa-envelope fa-fw" style={{marginRight: '5px'}} />)
    }
  }
});