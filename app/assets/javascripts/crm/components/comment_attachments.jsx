/*
  global $, React
*/
window.CommentAttachments = createReactClass({
  getInitialState: function(){
    return({
      attachments: [],
      newAttachment: false,
      loading: false
    });
  },
  componentWillReceiveProps (newProps) {
    if( newProps.temp_comment_id !== this.props.temp_comment_id ){
      this.loadAttachments();
    }
  },
  componentDidUpdate: function(){
    this.initFileUpload();
  },
  render: function(){
    if (this.props.valid){
      return(
        <li>
          <ul className="list-inline">
            {this.addAttachmentButton()}
            {this.listAttachments()}
          </ul>
        </li>
      )
    } else {
      return(null)
    }
  },
  addAttachmentButton: function(){
    return(
      <li>
        <div id={`new_attachment_form_${this.props.uniqueId}`}>
          <div className="form-group">
            <label className="btn btn-success btn-sm" style={{padding: '5px 5px'}}>
               <i className={this.loadingIcon('paperclip')} style={{fontSize: '15px'}}/><input id={`file_input_${this.props.uniqueId}`} type="file" className="form-control" ref='fileUpload' style={{display: 'none'}}/>
            </label>
          </div>
        </div>
      </li>
    )
  },
  loadAttachments: function(){
    if (!this.state.loading){
      this.setState({loading: true});
      $.ajax({
        method: 'GET',
        url: `/crm/attachments?&temp_comment_id=${this.props.temp_comment_id}`,
        success: (function(_this){
          return function(data){
            if (data){
              _this.setState({attachments: data.attachments, loading: false});
            }
          };
        })(this)
      });
      this.listAttachments();
    }
  },
  listAttachments: function(){
    var attachments = [];
    if (this.state.attachments.length > 0){
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
  loadingIcon: function(send_icon){
    if (this.state.loading){
      return('fa fa-refresh fa-spin');
    }else{
      return(`fa fa-${send_icon}`);
    }
  },
  deleteAttachment: function(attachment_id){
    $.ajax({
      method: 'DELETE',
      url: `/crm/attachments/${attachment_id}`
    });
    this.loadAttachments();
  },
  shortenUrlButton: function(id, url, shortUrl){
    if (this.props.gs && this.props.gs.config.google_api_key && this.props.subject_id){
      return(
        <ShortenUrl url={url} attachmentId={id} subjectId={this.props.subject_id} subjectType={this.props.subject_type} shortUrl={shortUrl} gs={this.props.gs} />
      );
    }
  },
  initFileUpload: function(){
    var uniqueId = this.props.uniqueId;
    var input_id = `#file_input_${uniqueId}`;
    var file = $(input_id);
    var _this = this;
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
    var url = `/crm/attachments/create_comment_attachment?temp_comment_id=${this.props.temp_comment_id}`
    return url;
  }
});