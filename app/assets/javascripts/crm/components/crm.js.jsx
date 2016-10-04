var CRM = React.createClass({
  getInitialState: function(){
    return {
      config: null,
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
      status: 'active',
      mainComponent: null
    };
  },
  init: function(){
    var _this = this;
    console.log('initialize config')
    $.ajax({
      method: 'GET',
      url: `/crm/config.json`,
      success: (function(data){
        _this.setState({config: data});
      })
    });
  },
  ticketFlags: function(){
    return (this.state.config==null ? [] : this.state.config.ticket_flags);
  },
  componentDidMount: function(){
    this.init();
    if (this.props.customerId){
      this.setCustomerId(this.props.customerId);
      this.loadTickets(this.props.customerId, 'all');
      $("#customer_list").effect('blind');
      $("#customer_search").effect('blind');
    }else{
      $("#customer_list").show();
      this.loadTickets();
    }
    if (this.props.ticketId){
      this.setState({ticketId: this.props.ticketId});
    }
  },
  render: function() {
    return (
      <section id="main-wrapper" className="theme-blue">
        <Header
          username={this.props.username}
          system_name={this.state.config ? this.state.config.system_name : null}
          loadCustomers={this.loadCustomers}
          handleSearch={this.handleSearch}
          />
        <Aside
          setCustomerId={this.setCustomerId}
          setTicketId={this.setTicketId}
          setCompany={this.setCompany}
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
            {this.state.mainComponent}
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
            <CustomerShowContainer
              key="customer_summary"
              customerId={this.state.customerId}
              customerDidLoad={this.customerDidLoad}
              config={this.state.config}
              loadTickets={this.loadTickets}
              />
            <Ticket 
              ticket={this.state.ticket}
              setCustomerId={this.setCustomerId}
              closedLabel={this.closedLabel}
              closeTicket={this.closeTicket}
              changeTicketStatusActive={this.changeTicketStatusActive}
              changeTicketStatusClosed={this.changeTicketStatusClosed}
              changeTicketFlag={this.changeTicketFlag}
              ticketFlags={this.ticketFlags()}
              />
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
              closedLabel={this.closedLabel}
              ticketFlags={this.ticketFlags()}
              config={this.state.config}
            />
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
    if (id==null){
      $("#customer_list").show();
      this.setState({pageTitle: null, customer: null});
    }
    this.setState({customerId: id});
    this.loadTickets(id, 'all');
  },
  customerDidLoad: function(customer){
    this.setState({pageTitle: customer.name});
    this.handlePageHistory(customer.name, `/crm/customer/${customer.id}`);
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
          ticketPagination: data.pagination,
          ticketPage: page});
        if (t.state.ticketId){
          t.setTicketId(t.state.ticketId);
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
        this.handlePageHistory(`${result[0].number}: ${result[0].title}`, `/crm/ticket/${ticketId}`);
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
  setCompany: function(companyId){
    this.setState({mainComponent: <CompanyShowContainer companyId={companyId} />})
  }
});