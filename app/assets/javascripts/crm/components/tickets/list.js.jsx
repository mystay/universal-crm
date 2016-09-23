var TicketList = React.createClass({
  getInitialState: function(){
    return({selectedTicketId: null})
  },
  render: function(){
    var t = []
    for (var i=0;i<this.props.tickets.length;i++){
      t.push(
        <li key={i} className={this.itemCss(this.props.tickets[i].id)} id={`ticket_${this.props.tickets[i].id}`}>
          <TicketListItem ticket={this.props.tickets[i]}
            ticketId={this.props.ticketId}
            setTicketId={this.props.setTicketId}
            setCustomerId={this.props.setCustomerId}
            priorityIcon={this.props.priorityIcon}
            closedLabel={this.props.closedLabel}
            priorityTicket={this.props.priorityTicket}
            changeTicketFlagPriority={this.props.changeTicketFlagPriority}
            changeTicketFlagNormal={this.props.changeTicketFlagNormal}
            changeTicketStatusActive={this.props.changeTicketStatusActive}
            changeTicketStatusClosed={this.props.changeTicketStatusClosed}
            />
        </li>
      )
    }
    ticketCountTitle = null
    if (this.ticketCount()){
      ticketCountTitle = this.ticketCountTitle()
    }
    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{ticketCountTitle}</h3>
        </div>
        <div className="panel-body">
          <ul className="list-group">
            {t}
          </ul>
          <Pagination
            pagination={this.props.pagination}
            currentPage={this.props.currentPage}
            pageResults={this.pageResults}
            displayDescription={true}
            />
        </div>
      </div>
    )
  },
  ticketCount: function(){
    if (this.props.pagination){
      return this.props.pagination.total_count;
    }else{
      return null;
    }
  },
  ticketCountTitle: function(){
    if (this.ticketCount()){
      h = `${this.ticketCount()} ticket`;
      if (this.ticketCount() != 1){h += `s`}
      return h;
    }
  },
  pageResults: function(page){
    this.props.loadTickets(this.props.customerId, null, page)
    this.setState({currentPage: page});
  },
  itemCss: function(ticketId){
    c = "list-group-item"
    if (this.props.ticketId==ticketId){
      c += " active"
    }
    return c;
  }
})