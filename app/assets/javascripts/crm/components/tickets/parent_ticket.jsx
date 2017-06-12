/*
  global React
  global ReactDOM
  global $
*/
var ParentTicket = React.createClass({
  render: function(){
    if (this.props.ticket){
      return(
        <div className="alert alert-success alert-sm">
          Related to: <a onClick={this.goTicket} style={{cursor: 'pointer'}}>{this.props.ticket.name}</a>
        </div>  
      );
    }else{
      return(null);
    }
  },
  goTicket: function(){
    this.props._goTicket(this.props.ticket.id);
  }
});