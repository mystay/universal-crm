var Comments = React.createClass({
  
  getInitialState: function(){
    return(
      {
        subject_id: null,
        comments: [],
        content: '',
        focused: false,
        loading: false,
        pastProps: null
      }
    )
  },
  init: function(){
    this.loadComments();
  },
  componentDidMount: function(){
    this.init();
  },
  componentDidUpdate: function(){
    if (this.state.pastProps != this.props && !this.state.loading){
      this.init();
    }
  },
  valid: function(){
    return (this.state.content != '');
  },
  handleChange: function(e){
    this.setState({content: e.target.value});
  },
  handleSubmit: function(e){
    var _this=this;
    e.preventDefault();
    if (!this.state.loading){
      this.setState({loading: true});
      $.ajax({
        method: 'POST',
        url: '/universal/comments',
        dataType: 'JSON',
        data:{
          subject_type: this.props.subject_type, subject_id: this.props.subject_id, content: this.state.content
        },
        success: function(data){
          _this.replaceState({comments: data, content: '', focused: false, loading: false});
          ReactDOM.findDOMNode(_this.refs.content).value='';
          showSuccess("Comments saved");
        }
      });
    }
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
            <textarea 
              className="form-control" 
              ref='content' 
              placeholder={this.props.newCommentPlaceholder} 
              onChange={this.handleChange} 
              style={this.textareaStyle()} />
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
          <i className={this.loadingIcon()} /> Save
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
    var _this=this;
    if (!this.state.loading){
      this.setState({loading: true, pastProps: this.props});
      $.ajax({
        method: 'GET',
        url: `/universal/comments?subject_type=${this.props.subject_type}&subject_id=${this.props.subject_id}`,
        dataType: 'JSON',
        data:{
          subject_type: this.props.subject_type, subject_id: this.props.subject_id, content: this.state.content
        },
        success: function(data){
          _this.setState({comments: data, subject_id: _this.props.subject_id, loading: false});
        }
      });
    }
  },
  openComments: function(){
    return (this.props.openComments==undefined || this.props.openComments==true);
  },
  loadingIcon: function(){
    if (this.state.loading){
      return('fa fa-refresh fa-spin');
    }else{
      return('fa fa-check');
    }
  },
  textareaStyle: function(){
    if (this.state.content){
      return {minHeight: '200px'}
    }else{
      return {height: '40px', backgroundColor: '#fafafa'}
    }
  }
});