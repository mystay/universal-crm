/*
  global React
*/
window.Comment = createReactClass({
  render: function(){
    var commentClass;
    if (this.props.comment.system_generated){
      commentClass = 'post system_generated';
    } else if (this.props.comment.incoming){
      commentClass = 'post primary';
    }else if (this.props.comment.kind=='note'){
      commentClass = 'post system_generated';
    }else{
      commentClass = `post default ${this.props.comment.kind}-kind`;
    }
    if (this.props.comment.incoming){
      return(
        <div className="row wrapper animated fadeInRight">
          <div className={this.column(10)}>
            <div className={commentClass}>
              <div className="pull-right small">{this.props.comment.when_formatted}</div>
              {this.arrow()}
              {this.content()}
            </div>
          </div>
          <div className={this.column(2)}>
            {this.author()}
          </div>
        </div>
      );
    }else{
      return(
        <div className="row wrapper animated fadeInRight">
          <div className={this.column(2)}>
            {this.author()}
          </div>
          <div className={this.column(10)}>
            <div className={commentClass} style={{overflow: 'hidden'}}>
              <div className="pull-right small">
                <ul className="comment-right-ul">
                  <li>{this.props.comment.when_formatted}</li>
                  {this.attachments()}
                </ul>
              </div>
              {this.arrow()}
              <p>{nl2br(this.props.comment.content)}</p>
            </div>
          </div>
        </div>
      );
    }
  },
  column: function(span){
    if (this.props.fullWidth){
      return 'col-sm-12';
    }else{
      return `col-sm-${span}`; 
    }
  },
  arrow: function(){
    if (!this.props.fullWidth && !this.props.comment.system_generated){
      if (this.props.comment.incoming){
        return(<span className="arrow right"></span>);
      }else{
        return(<span className="arrow left"></span>);
      }
    }else{
      return(null);
    }
  },
  attachments: function(){
    var attachments = []
    this.props.comment.attachments.forEach(function(attachment){
      attachments.push(<li key={attachment.url}><i className="fa fa-paperclip" /> <a href={`http:${attachment.url}`} target="_blank">{attachment.filename}</a></li>);
    });
    return (
      <div>
        {attachments}
      </div>
    )
  },
  author: function(){
    var timeago;
    if (this.props.comment.when){
       timeago = jQuery.timeago(this.props.comment.when);
    }
    if(this.props.fullWidth){
      return(
        <div>
          <small className='pull-right'>{timeago}</small>
          <span>{this.props.comment.author}</span>
        </div>
      );
    }else{
      return(
        <div>
          <span>{this.props.comment.author}</span>
          <div className="small">{timeago}</div>
        </div>
      );
    }
  },
  content: function(){
    if (this.props.comment.html_body){
      return(<p>{nl2br(this.props.comment.content)}</p>);
    }else{
      return(<p>{nl2br(this.props.comment.content)}</p>);
    }      
  }
});