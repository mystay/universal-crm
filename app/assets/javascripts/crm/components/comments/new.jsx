/*
  global React
  global ReactDOM
  global $
*/
window.NewComment = createReactClass({
  getInitialState: function(){
    return({
      loading: false,
      content: '',
      allowEmail: false,
      editing: false,
      uniqueId: null,
      tempCommentId: ''
    });
  },
  init: function(){
    var uniqueId = `comment_${this.props.subject_id}`;
    this.setState({uniqueId: uniqueId});
  },
  componentDidMount: function(){
    this.init();
    this.setState({allowEmail: this.props.allowEmail});
    this.setTempId();
  },
  valid: function(){
    return (this.state.content != '');
  },
  setTempId: function(){
    if (this.state.tempCommentId == ''){
      var tempCommentId = `${ new Date().getTime() }_${this.props.subject_id}`;
      this.setState({tempCommentId: tempCommentId});
    }
  },
  handleChange: function(e){
    if (!this.state.editing && this.props.subject_type == 'UniversalCrm::Ticket'){
      this.setState({editing: true});
      $.ajax({
        type: 'PATCH',
        url: `/crm/tickets/${this.props.subject_id}/editing`
      });
    }
    this.setState({content: e.target.value});
  },
  submitEmail: function(e){
    e.preventDefault();
    if (confirm('Are you sure you want to EMAIL this reply to the customer?')){
      this.handleSubmit(true);
    }
  },
  submitNote: function(e){
    e.preventDefault();
    if (this.state.allowEmail){
      if (confirm('This note will NOT be emailed to the customer')){
        this.handleSubmit(false);
      }
    }else{
      this.handleSubmit(false);
    }
  },
  handleSubmit: function(sendAsEmail){
    var _this=this;
    if (!this.state.loading){
      this.setState({loading: true});
      var emailKind = (sendAsEmail ? 'email' : 'note');
      $.ajax({
        method: 'POST',
        url: 'comments',
        dataType: 'JSON',
        data:{
          subject_type: this.props.subject_type,
          subject_id: this.props.subject_id,
          content: this.state.content,
          kind: emailKind,
          hide_private_comments: this.props.hidePrivateComments,
          temp_comment_id: this.state.tempCommentId
        },
        success: function(data){
          _this.setState({content: '', focused: false, loading: false, tempCommentId: ''});
          _this.props.updateCommentList(data);
          _this.setTempId();
          ReactDOM.findDOMNode(_this.refs.content).value='';
          showSuccess("Comments saved");
          if (_this.props.newCommentReceived){
            _this.props.newCommentReceived(data);
          }
        }
      });
    }
  },
  render: function(){
    return(
      <div>
        <div className="form-group">
          <textarea
            className="form-control"
            ref='content'
            placeholder={this.props.newCommentPlaceholder}
            onChange={this.handleChange}
            style={this.textareaStyle()} />
        </div>
        <div className="form-group">
          {this.progressBar()}
          <ul className="list-inline">
            {this.sendAsEmailButton()}
            {this.saveAsNoteButton()}
            <CommentAttachments
              valid={this.valid()}
              uniqueId={this.state.uniqueId}
              subject_id={this.props.subject_id}
              temp_comment_id={this.state.tempCommentId} />
          </ul>
        </div>
      </div>
    );
  },
  sendAsEmailButton: function(){
    if (this.valid() && this.state.allowEmail){
      return(
        <li>
          <button className={this.buttonClass('email')} onClick={this.submitEmail}>
            <i className={this.loadingIcon('paper-plane')} /> Send email
          </button>
        </li>
      )
    }else{
      return(null)
    }
  },
  progressBar: function(){
    return (
      <div id={`progress_${this.state.uniqueId}`} className="progress" style={{display: 'none'}}>
        <div className="progress-bar progress-bar-primary"></div>
      </div>
    )
  },
  saveAsNoteButton: function(){
    if (this.valid()){
      return(
        <li>
          <button className={this.buttonClass('note')} onClick={this.submitNote}>
            <i className={this.loadingIcon('check')} /> Save note
          </button>
        </li>
      )
    }else{
      return(null)
    }
  },
  loadingIcon: function(send_icon){
    if (this.state.loading){
      return('fa fa-refresh fa-spin');
    }else{
      return(`fa fa-${send_icon}`);
    }
  },
  buttonClass: function(type){
    if (type=='email'){
      return("btn btn-primary")
    }else if (type=='note'){
      return("btn btn-default btn-sm")
    }
  },
  textareaStyle: function(){
    if (this.state.content){
      return {minHeight: '150px'}
    }else{
      return {height: '40px', backgroundColor: '#fafafa'}
    }
  },
});
