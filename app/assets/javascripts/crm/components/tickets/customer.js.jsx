var TicketCustomerName = React.createClass({
  render: function(){
    if (this.props.name){
      return (
        <div onClick={this.setCustomerId} style={{textDecoration: 'underline', cursor: 'pointer', display: 'inline'}}>
          {this.props.name}
        </div>
      )
    }else{
      return(null);
    }
  },
  setCustomerId: function(){
    if (this.props._goCustomer){
      this.props._goCustomer(this.props.id);
    }
  },
});