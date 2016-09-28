var NewCustomer = React.createClass({
  getInitialState: function(){
    return({
      name: null,
      email: null
    })
  },
  handleSubmit: function(e){
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/crm/customers',
      dataType: 'JSON',
      data:{
        name: ReactDOM.findDOMNode(this.refs.name).value,
        email: ReactDOM.findDOMNode(this.refs.email).value
      },
      success: (function(_this){
        return function(data){
          ReactDOM.findDOMNode(_this.refs.name).value=''
          ReactDOM.findDOMNode(_this.refs.email).value=''
          _this.close();
          if (data.email){
            showSuccess('Customer created: ' + data.email);
          }
        }
      })(this)
    });
  },
  close: function(){
    this.props.displayNewCustomer(false);
  },
  render: function(){
    if (this.props.display){
      return(
        <div className="row">
          <div className="col-sm-6">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h3 className="panel-title">New Customer</h3>
                <div className="actions pull-right">
                  <i className="fa fa-times" onClick={this.close} />
                </div>
              </div>
              <div className="panel-body">
                <form onSubmit={this.handleSubmit} className="form-horizontal" role="form">
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Name</label>
                    <div className="col-sm-10"><input type="text" className="form-control" ref='name' /></div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Email</label>
                    <div className="col-sm-10"><input type="text" className="form-control" ref='email' /></div>
                  </div>
                  <div className="form-group">
                      <div className="col-sm-offset-2 col-sm-10">
                        <button className="btn btn-success">
                          <i className="fa fa-check" /> Update
                        </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )
    }else{
      return(null)
    }
  }
  
})