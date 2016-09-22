var TicketTitle = React.createClass({
  
  render: function(){
    if (this.props.ticket){
      return(
        <h4>
          {this.props.priorityIcon()}
          {this.props.closedLabel()}
          {this.props.ticket.title}
        </h4>  
      )
    }else{
      return(<div></div>)   
    }
  }  
});