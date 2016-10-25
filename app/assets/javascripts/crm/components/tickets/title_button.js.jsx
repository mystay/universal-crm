var TicketTitleButton = React.createClass({
  selectTicket: function(){
    this.props.selectTicketId(this.props.ticket.id);
  },
  render: function(){
    if (this.props.ticket){
      return(
        <div onClick={this.selectTicket} style={{cursor: 'pointer', fontWeight: 'bold'}}>
          <div className='pull-right small hidden-xs'>Ticket: #{this.props.ticket.number}</div>
          {this.statusLabel()}
          {this.emailIcon()}
          {this.props.ticket.title}
          <Flags flags={this.props.ticket.flags} gs={this.props.gs} />
          {this.tags()}
        </div>  
      )
    }else{
      return(null)   
    }
  },
  emailIcon: function(){
    if (this.props.ticket.kind.toString()=='email'){
      return(<i className="fa fa-envelope fa-fw" style={{marginRight: '5px'}} />)
    }
  },
  statusLabel: function(){
    if (this.props.ticket && this.props.ticket.status == 'closed'){
      return <span className='label label-default' style={{marginRight: '5px'}}>Closed</span>
    }else if (this.props.ticket && this.props.ticket.status == 'actioned'){
      return <span className='label label-success' style={{marginRight: '5px'}}>Actioned</span>
    }
  },
  tags: function(){
    var t = []
    for (var i=0;i<this.props.ticket.tags.length;i++){
      var tag_label = this.props.ticket.tags[i];
      t.push(<span className="badge badge-info" key={i} style={{marginRight: '2px'}}>{tag_label}</span>);      
    }
    if (t.length>0){
      return(<span style={{marginLeft: '10px'}}>{t}</span>);
    }else{
      return(null);
    }
  }
});