var CustomerEdit = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    $.ajax({
      method: 'PATCH',
      url: `/crm/customers/${this.props.customer.id}`,
      dataType: 'JSON',
      data:{
        customer: {name: ReactDOM.findDOMNode(this.refs.name).value, email: ReactDOM.findDOMNode(this.refs.email).value, phone_home: ReactDOM.findDOMNode(this.refs.phone_home).value, phone_work: ReactDOM.findDOMNode(this.refs.phone_work).value, phone_mobile: ReactDOM.findDOMNode(this.refs.phone_mobile).value}
      },
      success: (function(_this){
        return function(data){
          _this.props.handleEdit();
          _this.props.setCustomerId(_this.props.customer.id)
        }
      })(this)
    });
  },
  render: function(){
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-control" defaultValue={this.props.customer.name} ref='name' />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="text" className="form-control" defaultValue={this.props.customer.email} ref='email' />
          </div>
          <div className="form-group">
            <label>Phone (Home)</label>
            <input type="text" className="form-control" defaultValue={this.props.customer.phone_home} ref='phone_home' />
          </div>
          <div className="form-group">
            <label>Phone (Work)</label>
            <input type="text" className="form-control" defaultValue={this.props.customer.phone_work} ref='phone_work' />
          </div>
          <div className="form-group">
            <label>Phone (Mobile)</label>
            <input type="text" className="form-control" defaultValue={this.props.customer.phone_mobile} ref='phone_mobile' />
          </div>
          <div className="form-group">
            <button className="btn btn-success">
              <i className="fa fa-check" /> Update
            </button>
          </div>
        </form>
      </div>
    )
  }
});