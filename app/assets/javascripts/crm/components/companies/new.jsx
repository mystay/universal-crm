/*
  global React
  global ReactDOM
  global $
*/
window.NewCompany = createReactClass({
  getInitialState: function(){
    return({
      companyId: null,
      companyName: null,
      name: null,
      email: null
    });
  },
  componentDidMount: function(){
    var nameSearch = ReactDOM.findDOMNode(this.refs.name);
    var _this=this;
    $(nameSearch).autocomplete({
      source: `/crm/companies/autocomplete`,
      monLength: 3,
      autoFocus: false,
      delay: 400,
      select: function(e, ui){
        e.preventDefault();
        nameSearch.value = ui.item.label;
        _this.setState({companyId: ui.item.value, companyName: ui.item.label});
      },
      focus: function(e,ui){
        e.preventDefault();
        _this.setState({companyId: null, companyName: null});
      }
    });
    var emailSearch = ReactDOM.findDOMNode(this.refs.email);
    $(emailSearch).autocomplete({
      source: `/crm/companies/autocomplete`,
      monLength: 3,
      autoFocus: true,
      delay: 400,
      select: function(e, ui){
        e.preventDefault();
        emailSearch.value = ui.item.label;
        _this.setState({companyId: ui.item.value, companyName: ui.item.label});
      },
      focus: function(e,ui){
        e.preventDefault();
        _this.setState({companyId: null, companyName: null});
      }
    });
  },
  handleSearchChange: function(){
    this.setState({companyId: null});
  },
  handleSubmit: function(e){
    e.preventDefault();
    var _this=this;
    var modal = $('#new_company_modal');
    $.ajax({
      method: 'POST',
      url: '/crm/companies',
      dataType: 'JSON',
      data:{
        name: ReactDOM.findDOMNode(this.refs.name).value,
        email: ReactDOM.findDOMNode(this.refs.email).value
      },
      success: function(data){
        ReactDOM.findDOMNode(_this.refs.name).value='';
        ReactDOM.findDOMNode(_this.refs.email).value='';
        if (data.email){
          if (data.existing){
            showErrorMessage('Company/Email already exists: ' + data.name);
          }else{
            showSuccess('Company created: ' + data.name);
            modal.modal('hide');
            _this.props._goCompany(data.id);
          }
        }
      }
    });
  },
  render: function(){
    return(
      <form onSubmit={this.handleSubmit} className="form-horizontal" role="form">
        <div className="form-group">
          <label className="col-sm-2 control-label">Name</label>
          <div className="col-sm-10"><input type="text" className="form-control" ref='name' onChange={this.handleSearchChange} /></div>
        </div>
        {this.formEmail()}
        {this.companyExists()}
        {this.formSubmit()}
      </form>
    );
  },
  companyExists: function(){
    if (this.state.companyId){
      return(
        <div className="alert alert-danger alert-sm">
          That company already exists: <strong onClick={this.goCompany} data-id={this.state.companyId} style={{cursor: 'pointer'}}>{this.state.companyName}</strong>
        </div>
      );
    }
  },
  goCompany: function(e){
    $('#new_company_modal').modal('hide');
    this.props._goCompany($(e.target).attr('data-id'));
  },
  formEmail: function(){
    return(
      <div className="form-group">
        <label className="col-sm-2 control-label">Email</label>
        <div className="col-sm-10"><input type="text" className="form-control" ref='email' onChange={this.handleSearchChange} /></div>
      </div>
    );
  },
  formSubmit: function(){
    if (!this.state.companyId){
      return(
        <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-success">
                <i className="fa fa-check" /> Save
              </button>
          </div>
        </div>
      );
    }
  }
})