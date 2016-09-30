var Attachments = React.createClass({
  getInitialState: function(){
    return({
      subjectId: null,
      attachments: [],
      newAttachment: false,
      loading: false
    })
  },
  init: function(){
    var input_id = `#file_input_${this.props.customerId}`;
    var file = $(input_id);
    var _this = this;
    $(file).fileupload({
      dataType: 'json',
      url: this.url(),
      done: function (e, data) {
        _this.loadAttachments();
        $('#progress').hide();
        $('#progress .progress-bar').css('width', '0%');
        _this.toggleNew();
      },
      progressall: function (e, data) {
        $('#progress').show();
        $('#file_input').blur();
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css('width', progress + '%');
      }
    });
  },
  componentDidMount: function(){
    this.loadAttachments();
    this.init();
  },
  componentDidUpdate: function(){
    if (this.props.subjectId != null && this.props.subjectId != this.state.subjectId && !this.state.loading){
      this.loadAttachments();
      this.init();
    }
  },
  url: function(){
    return `/crm/attachments?subject_id=${this.props.subjectId}&subject_type=${this.props.subjectType}`
  },
  render: function(){
    return(
      <div>
        {this.list()}
        <hr />
        {this.newAttachment()}
        <div id="new_attachment_form" style={{display: 'none'}}>
          <div className="form-group">
            <input id={`file_input_${this.props.customerId}`} type="file" className="form-control" ref='fileUpload' />
            <div id="progress" className="progress" style={{display: 'none'}}>
              <div className="progress-bar progress-bar-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  list: function(){
    var attachments = [];
    if (this.state.attachments.length==0){
      return(<div className="alert alert-info alert-sm">There are no attachments to list</div>);
    }else{
      this.state.attachments.forEach(function(attachment){
        attachments.push(
          <li key={attachment.id}><a href={attachment.url} target="_blank">{attachment.file}</a></li>
        )
      });
      return(<ol>{attachments}</ol>)
    }
  },
  loadAttachments: function(){
    if (!this.state.loading){
      this.setState({loading: true});
      $.ajax({
        method: 'GET',
        url: `/crm/attachments?subject_id=${this.props.subjectId}&subject_type=${this.props.subjectType}`,
        success: (function(_this){
          return function(data){
            if (data){
              _this.setState({subjectId: _this.props.subjectId, attachments: data.attachments, loading: false});
            }
          }
        })(this)
      });
    }
  },
  toggleNew: function(){
    this.setState({newAttachment: true});
    $('#new_attachment_form').show();
  },
  newAttachment: function(){
    if(!this.state.newAttachment){
      return(
        <button className="btn btn-primary btn-sm" onClick={this.toggleNew}><i className="fa fa-plus" /> New</button>
      )
    }
  }
});