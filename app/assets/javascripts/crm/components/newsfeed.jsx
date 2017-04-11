/*
  global React
  global $
*/
var Newsfeed = React.createClass({
  getInitialState: function(){
    return({
      comments: [],
      loading: false
    });
  },
  componentDidMount: function(){
    this.init();
  },
  init: function(){
    this.loadFeed();
  },
  loadFeed: function(page){
    if (!this.state.loading){
      var _this=this;
      this.setState({loading: true});
      page = (page==undefined ? 1 : page);
      $.ajax({
        type: 'GET',
        url: `/universal/comments/recent.json`,
        data: {
          page: page
        },
        success: function(data){
          _this.setState({comments: data.comments, loading: false});
        }
      });
    }
  },
  render: function(){
    return(
      <div className="panel">
        <div className="panel-body">
          {this.commentList()}
        </div>
      </div>
    );
  },
  commentList: function(){
    var c = [];
    var pastSubjectId=null;
    var subjectTitle='';
    var commentTitle = this.commentTitle;
    this.state.comments.forEach(function(comment){
      if (pastSubjectId!=comment.subject_id){
        subjectTitle=commentTitle(comment);
      }else{
        subjectTitle='';
      }
      c.push(
        <div key={comment.id}>
          {subjectTitle}
          <Comment comment={comment} fullWidth={true} />
        </div>
      );
      pastSubjectId=comment.subject_id;
    });
    return(<div className="chat-widget">{c}</div>);
  },
  commentTitle: function(comment){
    if (comment.subject_type=='UniversalCrm::Ticket'){
      return(
        <h4 onClick={this.goTicket} data-subjectId={comment.subject_id} style={{cursor: 'pointer', fontWeight: 'bold'}} >{comment.subject_name}</h4>
      );
    }
  },
  goTicket: function(e){
    this.props._goTicket($(e.target).attr('data-subjectId'));
  }
});
