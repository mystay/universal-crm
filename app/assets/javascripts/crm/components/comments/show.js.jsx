var Comment = React.createClass({
  
  render: function(){
    var timeago = jQuery.timeago(this.props.comment.when)
    return(
      <div className="row wrapper animated fadeInRight">
        <div className="col-sm-2">
          <span>{this.props.comment.author}</span>
          <div className="small">{timeago}</div>
        </div>
        <div className="col-sm-10">
          <div className="post default">
            <span className="arrow left"></span>
            <p>{nl2br(this.props.comment.content)}</p>
          </div>
        </div>
      </div>
    )
  }
});