var Comments = React.createClass({
  
  getInitialState: function(){
    return(
      {
        subject_id: null,
        comments: [],
        content: '',
        focused: false,
        loading: false
      }
    )
  },
  componentDidMount: function(){
    this.loadComments();
  },
  componentDidUpdate: function(){
    if (this.props.subject_id != null && this.props.subject_id != this.state.subject_id && !this.state.loading){
      this.loadComments();
    }
  },
  valid: function(){
    return (this.state.content != '');
  },
  handleChange: function(e){
    this.setState({content: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/universal/comments',
      dataType: 'JSON',
      data:{
        subject_type: this.props.subject_type, subject_id: this.props.subject_id, content: this.state.content
      },
      success: (function(_this){
        return function(data){
          _this.replaceState({comments: data, content: '', focused: false});
          ReactDOM.findDOMNode(_this.refs.content).value='';
          //_this.props.countComments(data.length);
          showSuccess("Comments saved");
        }
      })(this)
    });
  },
  render: function(){
    if (this.props.newCommentPosition == 'bottom'){
      return(
        <div>
          {this.renderCommentList()}
          {this.renderCommentForm()}
        </div>
      )
    }else{
      return(
        <div>
          {this.renderCommentForm()}
          {this.renderCommentList()}
        </div>
      )
    }
  },
  renderCommentForm: function(){
    if (this.openComments()){
      return(
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <textarea className="form-control" ref='content' placeholder={this.props.newCommentPlaceholder} onChange={this.handleChange} style={{minHeight: '80px'}} />
          </div>
          <div className="form-group">
            {this.submitButton()}
          </div>
        </form>
      );
    }else{
      return(null);
    }
  },
  submitButton: function(){
    if (this.valid()){
      return(
        <button className="btn btn-primary btn-sm">
          <i className="fa fa-check" /> Save
        </button>
      )
    }else{
      return(null)
    }
  },
  renderCommentList: function(){
    var comments = []
    var fullWidth = this.props.fullWidth;
    this.state.comments.forEach(function(comment){
      comments.push(<Comment key={comment.id} comment={comment} fullWidth={fullWidth} />)
    });
    if (this.state.comments){
      return(
        <div className="chat-widget">
          {comments}
        </div>
      )
    }else{
      return(null)
    }
  },
  loadComments: function(){
    if (!this.state.loading){
      this.setState({loading: true});
      $.ajax({
        method: 'GET',
        url: `/universal/comments?subject_type=${this.props.subject_type}&subject_id=${this.props.subject_id}`,
        dataType: 'JSON',
        data:{
          subject_type: this.props.subject_type, subject_id: this.props.subject_id, content: this.state.content
        },
        success: (function(_this){
          return function(data){
            _this.setState({comments: data, subject_id: _this.props.subject_id});
            _this.setState({loading: false});
          }
        })(this)
      });
    }
  },
  openComments: function(){
    return (this.props.status == 'active');
  }
});