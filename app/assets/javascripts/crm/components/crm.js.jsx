var CRM = React.createClass({
  getInitialState: function(){
    return {
      tickets: [],
      ticketId: null,
      ticket: null,
      customers: [],
      customerId: null,
      customer: null,
      searchWord: '',
      searchTimer: null,
      ticketPagination: null,
      customerPagination: null,
      ticketPage: 1,
      customerPage: 1,
      pageTitle: null,
      pageSection: null,
      status: 'active'
    };
  },
  componentDidMount: function(){
    if (this.props.customerId){
      this.setState({customerId: this.props.customerId});
      this.loadCustomer(this.props.customerId);
      this.loadTickets(this.props.customerId, 'all');
      $("#customer_list").effect('blind');
      $("#customer_search").effect('blind');
    }else{
      $("#customer_list").show();
      this.loadTickets();
    }
    if (this.props.ticketId){
      this.setTicket(this.props.ticketId);
    }
  },
  render: function() {
    return (
      <section id="main-wrapper" className="theme-blue">
        <Header
          username={this.props.username}
          crm_title={this.props.crm_title}
          loadCustomers={this.loadCustomers}
          handleSearch={this.handleSearch}
          />
        <Aside
          setCustomerId={this.setCustomerId}
          setTicketId={this.setTicketId}
          loadPriorityTickets={this.loadPriorityTickets}
          loadActiveTickets={this.loadActiveTickets}
          loadClosedTickets={this.loadClosedTickets}
          />
        <section className="main-content-wrapper">
          <PageHeader
            pageSection={this.state.pageSection}
            pageTitle={this.state.pageTitle}
            setCustomerId={this.setCustomerId}
            setTicketId={this.setTicketId}
            />
          <section id="main-content" className="animated fadeInUp">
            <div className="row">
              <div className="col-lg-12">
                <CustomerList 
                  ref="customer_list"
                  key="customers"
                  customerId={this.state.customerId}
                  setCustomerId={this.setCustomerId} 
                  customers={this.state.customers}
                  customer={this.state.customer}
                  loadCustomers={this.loadCustomers}
                  handleSearch={this.handleSearch}
                  searchWord={this.state.searchWord}
                  pagination={this.state.customerPagination}
                  currentPage={this.state.customerPage}
                  hideCustomerList={this.hideCustomerList}
                />
              </div>
              <div className="col-lg-12">
                <CustomerSummary
                  key="customer_summary"
                  setCustomerId={this.setCustomerId}
                  customer={this.state.customer} />
                <Ticket 
                  ticket={this.state.ticket}
                  setCustomerId={this.setCustomerId}
                  priorityIcon={this.priorityIcon}
                  closedLabel={this.closedLabel}
                  closeTicket={this.closeTicket}
                  priorityTicket={this.priorityTicket}
                  changeTicketStatusActive={this.changeTicketStatusActive}
                  changeTicketStatusClosed={this.changeTicketStatusClosed}
                  changeTicketFlagPriority={this.changeTicketFlagPriority}
                  changeTicketFlagNormal={this.changeTicketFlagNormal}
                  />
                <NewTicket key="new_ticket"
                  customerId={this.state.customerId}
                  customer={this.state.customer}
                  loadTickets={this.loadTickets}/>
                <TicketList key='tickets'
                  customerId={this.state.customerId}
                  ticketId={this.state.ticketId}
                  setTicketId={this.setTicketId}
                  tickets={this.state.tickets}
                  customer={this.state.customer}
                  loadTickets={this.loadTickets}
                  pagination={this.state.ticketPagination}
                  currentPage={this.state.ticketPage}
                  setCustomerId={this.setCustomerId}
                  priorityIcon={this.priorityIcon}
                  closedLabel={this.closedLabel}
                  priorityTicket={this.priorityTicket}
                />
              </div>
            </div>
          </section>
        </section>
      </section>
    );
  },
  pageHeader: function(){
    if (this.state.pageTitle){
      return(<div className="page-header"><h1>{this.state.pageTitle}</h1></div>)
    }
  },
  indexByTicketId: function(ticketId){
    var result = null;
    $.each(this.state.tickets, function(index, item){
        if(item['id'].toString() == ticketId.toString()){
           result = index;
           return false;
        }
    });
    return result;
  },
  hideCustomerList: function(){
    $(ReactDOM.findDOMNode(this.refs.customer_list)).effect('blind');
  },
  showCustomerList: function(){
    $(ReactDOM.findDOMNode(this.refs.customer_list)).show();
  },
  loadCustomers: function(page){
    if (page==undefined){page=1;}
    console.log(this.state.searchWord)
    if(this.state.searchWord==''){
      this.setState({customers: [], searchTimer: null});
      this.hideCustomerList();
    }else{
      return $.ajax({
        method: 'GET',
        url: `/crm/customers?q=${this.state.searchWord}&page=${page}`,
        success: (function(_this){
          return function(data){
            _this.showCustomerList();
            return _this.setState({
              customers: data.customers,
              searchTimer: null,
              customerPagination: data.pagination,
              customerPage: page
            });
          }
        })(this)
      });
    }
  },
  setCustomerId: function(id){
    if (id!=null){
      $("#customer_search").effect('blind');
      $("#customer_list").effect('blind');
    }else{
//       this.loadCustomers();
      $("#customer_list").show();
      this.setState({pageTitle: null, customer: null});
    }
    this.setState({customerId: id});
    this.loadCustomer(id);
    this.loadTickets(id, 'all');
  },
  loadCustomer: function(id){
    this.setState({ticketId: null});
    if (id!=null){
      $.ajax({
        method: 'GET',
        url: `/crm/customers/${id}`,
        success: (function(_this){
          return function(data){
            if (data.customer){
              _this.setState({customer: data.customer, pageTitle: data.customer.name});
              _this.handlePageHistory(data.customer.name, `/crm/customer/${data.customer.id}`);
              $("#customer_summary").show();
            }
          }
        })(this)
      });
    }else{
      this.handlePageHistory('All customers', '/crm')
    }
  },
  loadTickets: function(customerId, status, page){
    this.setTicketId(null);
    scrollTo('body');
    if (customerId==null || customerId==undefined){customerId='';}
    if (status==null || status==undefined){status=this.state.status;}
    if (page==undefined){page=1;}
    var t = this;
    $.ajax({
      method: 'GET',
      url: `/crm/tickets?status=${status}&customer_id=${customerId}&page=${page}`,
      success: function(data){
        t.setState({
          tickets: data.tickets,
          customerId: customerId,
          ticketPagination: data.pagination,
          ticketPage: page});
        if (t.state.ticketId){
          t.setTicket(t.state.ticketId);
        }
      }
    });
  },
  handleSearch: function(e){
    this.setState({searchWord: e.target.value});
    if (this.state.searchTimer == null){
      this.setState({searchTimer: setTimeout(this.loadCustomers, 800)});
    }
  },
  handlePageHistory: function(title, url){
    document.title = title;
    window.history.replaceState({"pageTitle":title},'', url);
  },
  setTicketId: function(id){
    this.setTicket(id);
    if (id!=null){
      this.handlePageHistory('', `/crm/ticket/${id}`);
      scrollTo("body");
    }else{
      this.handlePageHistory('All customers', '/crm');
      scrollTo("body");
    }
  },
  setTicket: function(ticketId){
    if (ticketId==null){
        this.setState({ticket: null, ticketId: null});
    }else{
      var result = this.state.tickets.filter(function( obj ) {
        return obj.id == ticketId;
      });
      if (ticketId && result[0]){
        this.setState({ticketId: ticketId, ticket: result[0], pageTitle: `${result[0].number}: ${result[0].title}`});
      }
    }
  },
  loadClosedTickets: function(){
    this.setState({status: 'closed', pageTitle: 'Closed Tickets'})
    this.loadTickets(null, 'closed');
  },
  loadPriorityTickets: function(){
    console.log('priority')
    this.setState({pageTitle: 'Priority Tickets'})
    this.loadTickets(null, 'priority');
  },
  loadActiveTickets: function(){
    this.setState({status: 'active', pageTitle: 'Open Tickets'})
    this.loadTickets(null, 'active');
  },
  openTicketCount: function(){
    return 10;
  },
  closeTicket: function(){
    this.setTicketId(null);
  },  
  changeTicketStatusActive: function(){
    this.changeTicketStatus('active');
  },    
  changeTicketStatusClosed: function(){
    this.changeTicketStatus('closed')
  },    
  changeTicketFlagNormal: function(){
    this.changeTicketFlag('priority', false);
  },
  changeTicketFlagPriority: function(){
    this.changeTicketFlag('priority', true);
  },
  updateTicketInArray: function(ticket){
    var ticketIndex = this.indexByTicketId(ticket.id);
    var new_tickets = this.state.tickets;
    new_tickets[ticketIndex] = ticket;
    this.setState({tickets: new_tickets});
  },
  changeTicketFlag: function(f, add){
    $.ajax({
      method: 'PATCH',
      url: `/crm/tickets/${this.state.ticket.id}/flag?flag=${f}&add=${add}`,
      success: (function(_this){
        return function(data){
          _this.setState({ticket: data.ticket});
          _this.updateTicketInArray(data.ticket);
        }
      })(this)
    });
  },
  changeTicketStatus: function(s, add){
    $.ajax({
      method: 'PATCH',
      url: `/crm/tickets/${this.state.ticket.id}/update_status?status=${s}`,
      success: (function(_this){
        return function(data){
          if (s == 'closed'){
            _this.setTicketId(null)
          }
          _this.setState({ticket: data.ticket});
          _this.updateTicketInArray(data.ticket);
        }
      })(this)
    });
  },
});