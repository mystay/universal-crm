var TicketCommentsCreated = React.createClass({
  render: function(){
    return (
      <div className='pull-right'>
        {this.commentCount()} {this.props.ticket.updated_at}
      </div>
    ) 
  },
  commentCount: function(){
    html = []
    if (this.props.ticket.comment_count==1){
      html.push(`1 note`);
    }else if (this.props.ticket.comment_count>1){
      html.push(`${this.props.ticket.comment_count} notes`);
    }
    if (this.props.ticket.reply_count==1){
      html.push(`1 reply`);
    }else if (this.props.ticket.reply_count>1){
      html.push(`${this.props.ticket.reply_count} replies`);
    }
    return `(${html.join('/')})`;
  }
  
});