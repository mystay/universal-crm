var TicketCustomerName = React.createClass({
  render: function(){
    if (this.props.name){
      return (
        <div>
          <div onClick={this.setCustomerId} style={{textDecoration: 'underline', cursor: 'pointer', display: 'inline'}}>
            {this.props.name}
          </div> {this.draft()}
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
  draft: function(){
    if (this.props.status=='draft'){
      return(<span className="text-muted">(Draft)</span>);
    }
  },
});