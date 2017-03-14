var NewTicket = React.createClass({
  getInitialState: function(){
    return({
      title: '',
      data: '',
      loading: false
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
    if (this.props.subject){
      var placeholder=`New ticket for ${this.props.subject.name}...`
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
              placeholder="Content..."
              onChange={this.handleContentChange}
              style={{height: '250px'}}>{this.state.content}</textarea>
          </div>
        submitButton = <div className="form-group m-0">
            <button className='btn btn-primary btn-sm' onClick={this.handleSubmit}>
              <i className={this.loadingIcon()} /> Save
            </button>
          </div>
        if (this.props.gs.config && this.props.gs.config.transaction_email_address){
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
              Or, forward an email to: <a href={`mailto:${this.props.subject.inbound_email_address}`}>{this.props.subject.inbound_email_address}</a>
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
    var _this=this;
    if (!this.state.loading){
      this.setState({loading: true});
      var email = ReactDOM.findDOMNode(this.refs.email);
      email = (email!=undefined ? email.checked : false)
      $.ajax({
        method: 'POST',
        url: '/crm/tickets',
        dataType: 'JSON',
        data:{title: this.state.title, content: this.state.content, subject_id: this.props.subjectId, subject_type: this.props.subjectType, email: email},
        success: function(data){
          _this.setState({title: '', content: '', loading: false});
          _this.props._goTicket(data.ticket.id);
        }
      });
    }
  },
  loadingIcon: function(){
    if (this.state.loading){
      return('fa fa-refresh fa-spin');
    }else{
      return('fa fa-check');
    }
  }
});