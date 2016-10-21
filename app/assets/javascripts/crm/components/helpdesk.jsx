var Helpdesk = React.createClass({
  getInitialState: function(){
    return({
      subjectId: null,
      subjectType: null,
      documentId: null,
      documentType: null,
      title: null,
      content: null,
      loading: false,
      submitted: false
    });
  },
  componentDidMount: function(){
    this.setState({subjectId: this.props.subjectId, subjectType: this.props.subjectType, documentId: this.props.documentId, documentType: this.props.documentType});
  },
  setTitle: function(e){
    this.setState({title: e.target.value})
  },
  setContent: function(e){
    this.setState({content: e.target.value})
  },
  render: function(){
    return(
      <div title="Submit a Helpdesk request">
        <button className="btn btn-default" onClick={this.displayHelpdesk} style={{color: '#a94442'}}>
          <i className="fa fa-lg fa-question-circle" />  
        </button>
        {this.modal()}
      </div>
    );
  },
  modal: function(){
    return(
      <div className="modal fade" ref="helpdesk_modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 className="modal-title">{this.modalTitle()}</h4>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Subject..." ref="title" onChange={this.setTitle} />
              </div>
              <div className="form-group">
                <textarea className="form-control" placeholder="Message..." style={{height: '200px'}} ref="content" onChange={this.setContent} />
              </div>
              {this.submitButton()}
            </div>
          </div>
        </div>
      </div>
    )
  },
  displayHelpdesk: function(){
    var modal = ReactDOM.findDOMNode(this.refs.helpdesk_modal);
    console.log(modal);
    if (modal){
      $(modal).modal('show', {backdrop: 'static'});
    }
  },
  modalTitle: function(){
    if (this.props.name){
      return(`Submit a helpdesk ticket for: ${this.props.name}`);
    }else{
      return('Submit a helpdesk ticket')
    }
  },
  submitButton: function(){
    if (this.state.title && this.state.content){
      return(
        <div className="form-group">
          <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
          {this.loadingIcon()}
        </div>
      );
    }else if (this.state.submitted){
      return(<div className="alert alert-info">Your ticket has been submitted. We will respond shortly.</div>);
    }else{
      return(null);
    }
  },
  loadingIcon: function(){
    if (this.state.loading){
      return(<i className="fa fa-lg fa-refresh fa-spin" style={{marginLeft: '10px'}}/>)
    }else{
      return(null)
    }
  },
  handleSubmit: function(e){
    e.preventDefault();
    var _this=this;
    if (!this.state.loading){
      this.setState({loading: true});
      $.ajax({
        method: 'POST',
        url: `/crm/tickets`,
        data: {
          subject_id: this.state.subjectId,
          subject_type: this.state.subjectType,
          document_id: this.state.documentId,
          document_type: this.state.documentType,
          title: ReactDOM.findDOMNode(this.refs.title).value,
          content: ReactDOM.findDOMNode(this.refs.content).value,
          email: true,
          url: this.props.referrer,
          flag: 'helpdesk'
        },
        success: function(data){
          _this.setState({loading: false, submitted: true, title: null, content: null});
          ReactDOM.findDOMNode(_this.refs.title).value = ''
          ReactDOM.findDOMNode(_this.refs.content).value = ''
        }
      });
    }
  }
});