var ConfigForm = React.createClass({
  getInitialState: function(){
    return({inbound_domain: this.props.config.inbound_domain});
  },
  submitForm: function(e){
    e.preventDefault();
    this.props.updateChanges(this.refs);
  },
  changeInboundDomain: function(e){
    this.setState({inbound_domain: e.target.value});
  },
  render: function(){
    return(
      <form onSubmit={this.submitForm}>
        <div className="form-group">
          <label htmlFor="inbound_domain">Inbound Domain</label>
          <input type="text" className="form-control" defaultValue={this.props.config.inbound_domain} id="inbound_domain" ref="inbound_domain" onChange={this.changeInboundDomain} />
        </div>
        {this.supportEmailsTo()}
        <div className="form-group">
          <label htmlFor="transaction_email_address">Transactional Email Address</label>
          <p className="small">System emails will be sent FROM this address</p>
          <input type="text" className="form-control" defaultValue={this.props.config.transaction_email_address} id="transaction_email_address" ref="transaction_email_address" />
        </div>
        <div className="form-group">
          <label htmlFor="token">Token</label>
          <input type="text" className="form-control" defaultValue={this.props.config.token} id="token" disabled="disabled"/>
        </div>
        <div className="form-group">
          {this.submitButton('Save Changes')}
        </div>
      </form>
    )
  },
  submitButton: function(label){
    if (this.props.loading){
      label = 'Loading...'
    }
    return(
      <button className="btn btn-primary btn-block">{label}</button>
    )
  },
  supportEmailsTo: function(){
    if (this.state.inbound_domain){
      return(
        <div className="alert alert-sm alert-info">
          Forward support emails to: <a href={`mailto:${this.props.config.token}@${this.state.inbound_domain}`} target="_blank" style={{fontWeight: 'bold'}}>{this.props.config.token}@{this.state.inbound_domain}</a>
        </div>
      )
    }else{
      return(null)
    }
  }
})
