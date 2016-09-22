var CustomerSummary = React.createClass({
  getInitialState: function(){
    return {
      edit: false
    };
  },
  close: function(){
    $("#customer_summary").hide();
    $("#customer_search").show();
    this.props.setCustomerId(null);
    this.setState({edit: false});
  },
  handleEdit: function(){
    this.setState({edit: !this.state.edit})
  },
  render: function(){
    if (this.props.customer){
      return(
        <div className="row">
          <div className="col-sm-8">
            <div className="card">
              <div className="card-content">
                {this.renderViewEdit()}
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div>
              <div className="pull-right">
                <button className="btn btn-default btn-xs" onClick={this.close}>
                  <i className="fa fa-times" />
                  Hide
                </button>
              </div>
              <button className="btn btn-warning btn-xs" onClick={this.handleEdit}>
                <i className="fa fa-pencil" />
                {this.state.edit ? ' Cancel' : ' Edit'}
              </button>
            </div>
          </div>
        </div>
      );
    }else{
      return(<div></div>) ;
    }
  },
  renderViewEdit: function(){
    if (this.state.edit){
      return(
        <CustomerEdit
          customer={this.props.customer}
          handleEdit={this.handleEdit}
          setCustomerId={this.props.setCustomerId} />
      )
    }else{
      return(
        <div>
          <dl className="dl-horizontal">
            <dt> Email:</dt>
            <dd>{this.props.customer.email}</dd>
            <dt>Phone (Home):</dt>
            <dd>{this.props.customer.phone_home}</dd>
            <dt>Phone (Work):</dt>
            <dd>{this.props.customer.phone_work}</dd>
            <dt>Phone (Mobile):</dt>
            <dd>{this.props.customer.phone_mobile}</dd>
          </dl>
          <Tags subject_type="UniversalCrm::Customer" subject_id={this.props.customer.id} tags={this.props.customer.tags} />
        </div>
      )
    }
  }
});