var NewTicket = React.createClass({
  getInitialState: function(){
    return({
      title: '',
      data: '',
      loading: false,
      kind: null
    })
  },
  handleContentChange: function(e){
    this.setState({content: e.target.value});
  },
  handleTitleChange: function(e){
    this.setState({title: e.target.value});
  },
  selectKind: function(e){
    this.setState({kind: $(e.target).attr('data-kind')});
  },
  buttonList: function(){
    var buttons = [];
    buttons.push(<button key="btn-note" className="btn btn-info btn-sm" data-kind="note" onClick={this.selectKind}><i className="fa fa-sticky-note" /> New Note</button>
    )
    buttons.push(<button key="btn-task" className="btn btn-info btn-sm" data-kind="task" onClick={this.selectKind}><i className="fa fa-check-circle" /> New Task</button>
    )
    if (this.props.gs.config && this.props.gs.config.transaction_email_address && this.props.subject.email){
      buttons.push(<button key="btn-email" className="btn btn-info btn-sm" data-kind="email" onClick={this.selectKind}><i className="fa fa-envelope" /> New Email</button>
      )
    }
    return <div className="btn-group">{buttons}</div>;
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
        if (this.props.gs.config && this.props.gs.config.transaction_email_address && this.props.subject.email){
          emailCheckbox = (
            <div className="form-group">
              <label>
                <input type="checkbox" ref="email" /> Send as email <small>({this.props.subject.email})</small>
              </label>
            </div>
          )
        }
      }
      return(
        <div>
          {this.buttonList()}
          {this.newForm()}
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
  },
  newForm: function(){
    var form;
    if (this.state.kind=='note'){
      form = this.newNote();
    }else if (this.state.kind=='task'){
      form = this.newTask();
    }else if (this.state.kind=='email'){
      form = this.newEmail();
    }
    return(
      <div className="panel">
        <div className="panel-body">
          {form}
        </div>
      </div>
    );
  },
  newNote: function(){
    return(
      <div>
        {this.titleField()}
      </div>
    );
  },
  newTask: function(){
    return(
      <div>
        {this.titleField()}
      </div>
    );
  },
  newEmail: function(){
    return(
      <div>
        {this.titleField()}
      <p className="small text-muted no-margin">
            Or, forward an email to: <a href={`mailto:${this.props.subject.inbound_email_address}`}>{this.props.subject.inbound_email_address}</a>
          </p>
          </div>
    );
  },
  titleField: function(){
    return(
      <div className='form-group'>
        <input type='text' 
         value={this.state.title} 
         className='form-control'
         onChange={this.handleTitleChange} />
      </div>
    );
  }
});