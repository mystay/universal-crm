var Comment = React.createClass({
  
  render: function(){
    return(
      <div className="row wrapper animated fadeInRight">
        <div className={this.column(2)}>
          {this.author()}
        </div>
        <div className={this.column(10)}>
          <div className="post default">
            {this.arrow()}
            <p>{nl2br(this.props.comment.content)}</p>
          </div>
        </div>
      </div>
    )
  },
  column: function(span){
    if (this.props.fullWidth){
      return 'col-sm-12';
    }else{
      return `col-sm-${span}`; 
    }
  },
  arrow: function(){
    if (!this.props.fullWidth){
      return(<span className="arrow left"></span>);
    }else{
      return(null);
    }
  },
  author: function(){
    var timeago
    if (this.props.comment.when){
       timeago = jQuery.timeago(this.props.comment.when);
    }
    if(this.props.fullWidth){
      return(
        <div>
          <small className='pull-right'>{timeago}</small>
          <span>{this.props.comment.author}</span>
        </div>
      )
    }else{
      return(
        <div>
          <span>{this.props.comment.author}</span>
          <div className="small">{timeago}</div>
        </div>
      )
    }
  }
});