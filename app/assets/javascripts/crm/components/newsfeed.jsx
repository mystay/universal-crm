/*
  global React
  global $
*/
var Newsfeed = React.createClass({
  getInitialState: function(){
    return({
      comments: [],
      loading: false,
      pagination: null,
      pageNum: null,
      userId: null,
      ticketKind: null
    });
  },
  componentDidMount: function(){
    this.init();
  },
  init: function(){
    this.loadFeed();
  },
  loadFeed: function(page, userId, ticketKind){
    if (!this.state.loading){
      var _this=this;
      this.setState({loading: true, userId: userId, ticketKind: ticketKind});
      page = (page==undefined ? 1 : page);
      $.ajax({
        type: 'GET',
        url: `/universal/comments/recent.json`,
        data: {
          page: page,
          user_id: userId,
          subject_kind: ticketKind
        },
        success: function(data){
          _this.setState({
            comments: data.comments,
            loading: false,
            pagination: data.pagination,
            pageNum: page
          });
        }
      });
    }
  },
  render: function(){
    return(
      <div className="panel">
        <div className="panel-body">
          {this.ticketKindList()}
          {this.userList()}
          <hr />
          {this.commentList()}
          <Pagination
            pagination={this.state.pagination}
            currentPage={this.state.pageNum}
            pageResults={this.pageResults}
            displayDescription={true}
            />
        </div>
      </div>
    );
  },
  ticketKindList: function(){
    var u = [];
    u.push(<button className={`btn btn-sm btn-${this.state.ticketKind=='email' ? 'primary' : 'default'}`} data-kind="email" onClick={this.selectTicketKind} >Emails</button>);
    u.push(<button className={`btn btn-sm btn-${this.state.ticketKind=='task' ? 'primary' : 'default'}`} data-kind="task" onClick={this.selectTicketKind} >Tasks</button>);
    u.push(<button className={`btn btn-sm btn-${this.state.ticketKind=='normal' ? 'primary' : 'default'}`} data-kind="normal" onClick={this.selectTicketKind} >Notes</button>);
    return(<div className="btn-group">{u}</div>);
  },
  userList: function(){
    if (this.props.gs && this.props.gs.users){
      var u = [];
      for (var i=0;i<this.props.gs.users.length;i++){
        var user = this.props.gs.users[i];
        u.push(<div className="col-xs-2" key={user.id}>{this.userButton(user)}</div>);
      }
      return(<div className="row">{u}</div>);
    }
  },
  userButton: function(user){
    return(
      <button className={`btn btn-${this.state.userId==user.id ? 'primary' : 'default'} btn-sm btn-block`} onClick={this.selectUser} data-id={user.id} data-name={user.name}>{user.name}</button>
    );
  },
  selectUser: function(e){
    var userId = $(e.target).attr('data-id');
    this.loadFeed(1, userId, this.state.ticketKind);
  },
  selectTicketKind: function(e){
    var ticketKind = $(e.target).attr('data-kind');
    this.loadFeed(1, this.state.userId, ticketKind);
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
  },
  pageResults: function(page){
    this.loadFeed(page, this.state.userId, this.state.ticketKind);
    this.setState({currentPage: page});
  }
});
