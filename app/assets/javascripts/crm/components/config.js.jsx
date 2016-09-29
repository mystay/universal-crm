var Config = React.createClass({
  
  getInitialState: function(){
    return(
      {config: null, signedIn: false, loading: false}
    )
  },
  componentDidMount: function(){
    this.init();
  },
  init: function(){
    $.ajax({
      method: 'GET',
      url: `/crm/config.json`,
      success: (function(_this){
        return function(data){
          _this.setState({config: data});
        }
      })(this)
    });
  },
  render: function(){
    return(
      <div>
        <header><BrandLogo crm_title={this.props.crm_title} /></header>
        <div className="panel panel-primary" id="locked-screen">
          <div className="panel-heading">
            <h3 className="panel-title">Config</h3>
          </div>
          <div className="panel-body">
            {this.configForm()}
          </div>
        </div>
      </div>
    )
  },
  configForm: function(){
    if (this.state.signedIn){
      return(<ConfigForm config={this.state.config} updateChanges={this.updateChanges} loading={this.state.loading} />);
    }else{
      return(<ConfigLogin config={this.state.config} submitNewPassword={this.submitNewPassword} signIn={this.signIn} loading={this.state.loading} />);
    }
  },
  loading: function(){
    this.setState({loading: true});
  },
  finished: function(){
    this.setState({loading: false});
  },
  submitNewPassword: function(password){
    this.loading();
    $.ajax({
      method: 'POST',
      url: '/crm/config/set_password',
      dataType: 'JSON',
      data:{
        password: password
      },
      success: (function(_this){
        return function(data){
          _this.setState({config: data});
          showSuccess('Password saved: ' + password);
          _this.finished();
        }
      })(this)
    });
  },
  signIn: function(password){
    this.loading();
    $.ajax({
      method: 'POST',
      url: '/crm/config/signin',
      dataType: 'JSON',
      data:{
        password: password
      },
      success: (function(_this){
        return function(data){
          _this.setState({signedIn: data.signedIn});
          if (data.signedIn){
            showSuccess('Password accepted');  
          }else{
            showErrorMessage('Incorrect password');  
          }
          _this.finished();
        }
      })(this)
    });
  },
  updateChanges: function(refs){
    this.loading();
    $.ajax({
      method: 'PATCH',
      url: '/crm/config',
      dataType: 'JSON',
      data:{
        config: {
          inbound_domain: ReactDOM.findDOMNode(refs.inbound_domain).value,
          transaction_email_address: ReactDOM.findDOMNode(refs.transaction_email_address).value
        }
      },
      success: (function(_this){
        return function(data){
          showSuccess('Config updated');
          _this.setState({config: data});
          _this.finished();
        }
      })(this)
    });
  }
});