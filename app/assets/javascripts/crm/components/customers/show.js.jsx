var CustomerShow = React.createClass({
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
    console.log("Load: " + this.props.customerId)
    if (id!=undefined&& id != ''&&!this.state.loading){
      this.setState({loading: true});
      $.ajax({
        method: 'GET',
        url: `/crm/customers/${id}.json`,
        success: (function(_this){
          return function(data){
            if (data.customer){
              _this.setCustomer(data.customer);
            }
          }
        })(this)
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
        <div className="row">
          <div className="col-sm-6">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h3 className="panel-title">{this.state.customer.name}</h3>
              </div>
              <div className="panel-body">
                {this.renderViewEdit()}
              </div>
              <div className="panel-footer text-right">
                <button className="btn btn-warning btn-sm m-0" onClick={this.handleEdit}>
                  <i className="fa fa-pencil" />
                  {this.state.edit ? ' Cancel' : ' Edit'}
                </button>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">General Notes</h3>
              </div>
              <div className="panel-body">
                <Comments 
                  subject_type='UniversalCrm::Customer'
                  subject_id={this.state.customer.id}
                  newCommentPosition='bottom'
                  status='active'
                  newCommentPlaceholder='New note...'
                  fullWidth={true}
                  />
              </div>
            </div>
          </div>
        </div>
      );
    }else{
      return(null);
    }
  },
  renderViewEdit: function(){
    if (this.state.edit){
      return(
        <CustomerEdit
          customer={this.state.customer}
          handleEdit={this.handleEdit}
          setCustomerId={this.setCustomerId}
          setCustomer={this.setCustomer}
          />
      )
    }else{
      return(
        <div className="row">
          <div className="col-sm-8">
            <dl className="dl-horizontal">
              <dt> Email:</dt>
              <dd>{this.state.customer.email}</dd>
              <dt>Phone (Home):</dt>
              <dd>{this.state.customer.phone_home}</dd>
              <dt>Phone (Work):</dt>
              <dd>{this.state.customer.phone_work}</dd>
              <dt>Phone (Mobile):</dt>
              <dd>{this.state.customer.phone_mobile}</dd>
            </dl>
            <Tags subjectType="UniversalCrm::Customer" subjectId={this.state.customer.id} tags={this.state.customer.tags} />
          </div>
        </div>
      )
    }
  },
  setCustomerId: function(){
    if (this.props.setCustomerId){
      this.props.setCustomerId();
    }
  }
});