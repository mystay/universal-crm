var NewTicket = React.createClass({
  getInitialState: function(){
    return({
      title: '',
      data: ''
    })
  },
  handleContentChange: function(e){
    this.setState({content: e.target.value});
  },
  handleTitleChange: function(e){
    this.setState({title: e.target.value});
  },
  render: function(){
    var titleField=null;
    var contentField=null;
    var submitButton=null;
    var emailCheckbox=null
    if (this.props.customer){
      var placeholder=`New ticket for ${this.props.customer.name}...`
      titleField = <div className='form-group'>
                    <input type='text' 
                               value={this.state.title} 
                               className='form-control'
                               placeholder={placeholder}
                               onChange={this.handleTitleChange} />
                    </div>
      if (this.state.title){
        contentField = <div className="form-group">
            <textarea className="form-control" 
              placeholder="Details..."
              onChange={this.handleContentChange}
              style={{height: '100px'}}>{this.state.content}</textarea>
          </div>
        submitButton = <div className="form-group m-0">
            <button className='btn btn-primary btn-sm' onClick={this.handleSubmit}>
              <i className='fa fa-check' /> Save
            </button>
          </div>
        if (this.props.config.transaction_email_address){
          emailCheckbox = (
            <div className="form-group">
              <label>
                <input type="checkbox" ref="email" /> Send as email
              </label>
            </div>
          )
        }
      }
      return(
        <div className="panel">
          <div className="panel-body">
            {titleField}
            {contentField}
            {emailCheckbox}
            {submitButton}
            <p className="small text-muted">
              Or, send an email to:
              <a href={`mailto:${this.props.customer.inbound_email_address}`} target="_blank">
                {this.props.customer.inbound_email_address}
              </a>
            </p>
          </div>
        </div>
      )
    }else{
      return(null);                              
    }
  },
  handleSubmit: function(e){
    e.preventDefault();
    var email = ReactDOM.findDOMNode(this.refs.email);
    email = (email!=undefined ? email.checked : false)
    $.ajax({
      method: 'POST',
      url: '/crm/tickets',
      dataType: 'JSON',
      data:{title: this.state.title, content: this.state.content, customer_id: this.props.customerId, email: email},
      success: (function(_this){
        return function(data){
          _this.setState({title: '', content: ''});
          _this.props.loadTickets(_this.props.customerId);
        }
      })(this)
    });
  }
});