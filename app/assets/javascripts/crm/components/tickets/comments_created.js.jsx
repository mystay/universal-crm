var TicketCommentsCreated = React.createClass({
  render: function(){
    return (
      <div className='pull-right'>
        {this.commentCount()}
        {this.props.ticket.updated_at}
      </div>
    ) 
  },
  commentCount: function(){
    if (this.props.commentCount>0){
      return `(${this.props.commentCount} comments) `;
    }
  }
  
});