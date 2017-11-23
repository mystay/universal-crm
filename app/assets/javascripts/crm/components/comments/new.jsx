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
      tempCommentId: '',
      attachments: []
    });
  },
  init: function(){
    var uniqueId = `comment_${this.props.subject_id}`;
    this.setState({uniqueId: uniqueId});
  },
  componentDidMount: function(){
    this.init();
    this.setState({allowEmail: this.props.allowEmail});
    this.initFileUpload();
    this.setTempId();
    this.loadAttachments();
  },
  valid: function(){
    return (this.state.content != '');
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
        url: '/universal/comments',
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
          _this.loadAttachments();
          _this.props.updateCommentList(data);
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
            {this.addAttachmentButton()}
            {this.listAttachments()}
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
            <i className={this.loadingIcon('send')} /> Send email
          </button>
        </li>
      )
    }else{
      return(null)
    }    
  },
  addAttachmentButton: function(){
    if (this.valid() && this.state.allowEmail){
      return(
        <li>
          <div id={`new_attachment_form_${this.state.uniqueId}`}>
            <div className="form-group">
              <label className="btn btn-success btn-sm" style={{padding: '5px 5px'}}>
                 <i className={this.loadingIcon('paperclip')} style={{fontSize: '15px'}}/><input id={`file_input_${this.state.uniqueId}`} type="file" className="form-control" ref='fileUpload' style={{display: 'none'}}/>
              </label>
            </div>
          </div>
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
  loadAttachments: function(){
    if (!this.state.loading){
      this.setState({loading: true});
      $.ajax({
        method: 'GET',
        url: `/crm/attachments?&temp_comment_id=${this.state.tempCommentId}`,
        success: (function(_this){
          return function(data){
            if (data){
              _this.setState({subjectId: _this.props.subject_id, attachments: data.attachments, loading: false});
            }
          };
        })(this)
      });
      this.listAttachments();
    }
  },
  listAttachments: function(){
    var attachments = [];
    if (this.state.attachments.length > 0 && this.state.editing){
      var shortenUrlButton = this.shortenUrlButton;
      var filename=null;
      var _this = this;
      this.state.attachments.forEach(function(attachment){
        if (attachment.name){
          filename = attachment.name;
        }else{
          filename = attachment.file;
        }
        attachments.push(
          <li key={attachment.id}>
            <h5>
              <a href={attachment.url} target="_blank"><i className="fa fa-paperclip" />{filename}</a>
              <label className="btn" onClick={ () => _this.deleteAttachment(attachment.id)} style={{padding: '0'}}>
                <i className={_this.loadingIcon('trash-o')} />
              </label>
            </h5>
          </li>
        );
      });
      return(
        <li>
          <ul className="list-inline">{attachments}</ul>
        </li>
      );
    }
  },
  deleteAttachment: function(attachment_id){
    $.ajax({
      method: 'DELETE',
      url: `/crm/attachments/${attachment_id}`
    });
    this.loadAttachments();
    console.log(`Attachment: ${attachment_id}`)
  },
  shortenUrlButton: function(id, url, shortUrl){
    if (this.props.gs && this.props.gs.config.google_api_key && this.props.subject_id){
      return(
        <ShortenUrl url={url} attachmentId={id} subjectId={this.props.subject_id} subjectType={this.props.subject_type} shortUrl={shortUrl} gs={this.props.gs} />
      );
    }
  },
  componentDidUpdate: function(){
    this.initFileUpload();
  },
  setTempId: function(){
    if (this.state.tempCommentId == ''){
      var tempCommentId = `${ new Date().getTime() }_${this.props.subject_id}`;
      this.setState({tempCommentId: tempCommentId});
    }
  },
  initFileUpload: function(){
    var uniqueId = this.state.uniqueId;
    var input_id = `#file_input_${uniqueId}`;
    var file = $(input_id);
    var _this = this;
    this.setTempId();
    $(file).fileupload({
      dataType: 'json',
      url: this.url(),
      done: function (e, data) { 
        _this.loadAttachments();
        $(`#progress_${uniqueId}`).hide();
        $(`#progress_${uniqueId} .progress-bar`).css('width', '0%');
      },
      progressall: function (e, data) {
        $(`#progress_${uniqueId}`).show();
        $('#file_input').blur();
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $(`#progress_${uniqueId} .progress-bar`).css('width', progress + '%');
      }
    });
  },
  url: function(){
    var url = `/crm/attachments/create_comment_attachment?temp_comment_id=${this.state.tempCommentId}`
    return url;
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