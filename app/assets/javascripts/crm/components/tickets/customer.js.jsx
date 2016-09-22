var TicketCustomerName = React.createClass({
  render: function(){
    if (this.props.name){
      return (
        <div onClick={this.props.setCustomerId} style={{textDecoration: 'underline', cursor: 'pointer'}}>
          {this.props.name}
        </div>
      )
    }else{
      return(<div></div>)
    }
  }
});