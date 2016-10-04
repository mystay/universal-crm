var CustomerShowContainer = React.createClass({
  getInitialState: function(){
    return {
      edit: false,
      customer: null,
      customerId: null,
      loading: false
    };
  },
  componentDidMount: function(){
    this.loadCustomer(this.props.customerId);
  },
  componentDidUpdate: function(){
    if (this.props.customerId != null && this.props.customerId != this.state.customerId && !this.state.loading){
      this.loadCustomer(this.props.customerId);
    }else if (this.props.customerId==null && this.state.customerId!=null){
      this.setState({customer: null, customerId: null})
    }
  },
  loadCustomer: function(id){
    var _this=this;
    if (id!=undefined&& id != ''&&!this.state.loading){
      this.setState({loading: true});
      $.ajax({
        method: 'GET',
        url: `/crm/customers/${id}.json`,
        success: function(data){
          if (data.customer){
            _this.setCustomer(data.customer);
          }
        }
      });
    }
  },
  setCustomer: function(customer){
    this.setState({customer: customer, customerId: customer.id, edit: false, loading: false});
    if (this.props.customerDidLoad){this.props.customerDidLoad(customer)}
  },
  handleEdit: function(){
    this.setState({edit: !this.state.edit})
  },
  render: function(){
    if (this.props.customerId && this.state.customer){
      return(
        <CustomerShow 
          customer={this.state.customer}
          edit={this.state.edit}
          handleEdit={this.handleEdit}
          loadTickets={this.props.loadTickets}
          setCustomer={this.setCustomer}
          config={this.props.config} />
      );
    }else{
      return(null);
    }
  },
  setCustomerId: function(){
    if (this.props.setCustomerId){
      this.props.setCustomerId();
    }
  }
});