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
        <div className="panel panel-info">
          <div className="panel-heading">
            <h3 className="panel-title">{this.props.customer.name}</h3>
            <div className="actions pull-right">
              <i className="fa fa-times" onClick={this.close} />
            </div>
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
        <div className="row">
          <div className="col-sm-8">
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
          </div>
          <div className="col-sm-4">
            <Tags subject_type="UniversalCrm::Customer" subject_id={this.props.customer.id} tags={this.props.customer.tags} />
          </div>
        </div>
      )
    }
  }
});