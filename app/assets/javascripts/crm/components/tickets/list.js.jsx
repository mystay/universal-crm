var TicketList = React.createClass({
  getInitialState: function(){
    return({
      subjectId: null,
      subjectType: null,
      tickets: null,
      selectedTicketId: null,
      status: null,
      loading: false,
      pagination: null,
      pageNum: null
    })
  },
  componentDidMount: function(){
    this.setState({status: this.props.status, subjectId: this.props.subjectId, subjectType: this.props.subjectType});
    this.loadTickets(this.props.status);
  },
  componentDidUpdate: function(){
    if (this.props.status != null && this.props.status != this.state.status && !this.state.loading){
      this.loadTickets(this.props.status);
    }else if (this.props.subjectId != null && this.props.subjectId != this.state.subjectId && !this.state.loading){
      this.loadTickets();
    }else if (this.props.status==null && this.state.status!=null){
      this.setState({tickets: null, status: null})
    }
  },
  loadTickets: function(status, page){
    if (!this.state.loading){
      this.setState({loading: true});
      scrollTo('body');
      if (status==null || status==undefined){status=this.state.status;}
      if (page==undefined){page=1;}
      var _this = this;
      $.ajax({
        method: 'GET',
        url: `/crm/tickets?status=${status}&subject_id=${this.props.subjectId}&subject_type=${this.props.subjectType}&page=${page}`,
        success: function(data){
          _this.setState({
            status: status,
            loading: false,
            subjectId: _this.props.subjectId,
            tickets: data.tickets,
            pagination: data.pagination,
            pageNum: page});
        }
      });
    }
  },
  render: function(){
    if (this.state.tickets && this.state.tickets.length>0){
      var t = []
      for (var i=0;i<this.state.tickets.length;i++){
        t.push(
          <li key={i} className="list-group-item">
            <TicketListItem
              ticket={this.state.tickets[i]}
              _goTicket={this.props._goTicket}
              _goCustomer={this.props._goCustomer}
              setCustomerId={this.props.setCustomerId}
              gs={this.props.gs}
              sgs={this.props.sgs}
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
              pagination={this.state.pagination}
              currentPage={this.state.pageNum}
              pageResults={this.pageResults}
              displayDescription={true}
              />
          </div>
        </div>
      )
    }else{
      return(null);
    }
  },
  ticketCount: function(){
    if (this.state.pagination){
      return this.state.pagination.total_count;
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
    this.loadTickets(this.state.status, page)
    this.setState({currentPage: page});
  }
})