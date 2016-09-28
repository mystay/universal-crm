var TicketList = React.createClass({
  getInitialState: function(){
    return({selectedTicketId: null})
  },
  render: function(){
    var t = []
    for (var i=0;i<this.props.tickets.length;i++){
      t.push(
        <li key={i} className="list-group-item">
          <TicketListItem ticket={this.props.tickets[i]}
            ticketId={this.props.ticketId}
            setTicketId={this.props.setTicketId}
            setCustomerId={this.props.setCustomerId}
            closedLabel={this.props.closedLabel}
            changeTicketStatusActive={this.props.changeTicketStatusActive}
            changeTicketStatusClosed={this.props.changeTicketStatusClosed}
            config={this.props.config}
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
  }
})