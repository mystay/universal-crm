var CRM = React.createClass({
  getInitialState: function(){
    return {
      config: null,
      tickets: [],
      customers: [],
      customerId: null,
      customer: null,
      searchWord: '',
      searchTimer: null,
      customerPagination: null,
      ticketPage: 1,
      customerPage: 1,
      pageTitle: null,
      pageSection: null,
      status: 'active',
      mainComponent: null,
      subComponent: null
    };
  },
  componentDidMount: function(){
    var _this = this;
    $.ajax({
      method: 'GET',
      url: `/crm/config.json`,
      success: (function(data){
        console.log('config loaded')
        _this.setState({config: data});
        _this.init(_this);
      })
    });
  },
  init: function(_this){
    console.log('initializing')
    if (_this.props.customerId){
      _this._goCustomer(_this.props.customerId);
    }else 
    if (_this.props.companyId){
      _this._goCustomer(_this.props.companyId);
    }
    if (_this.props.ticketId){
      _this._goTicket(_this.props.ticketId);
    }else{
      _this._goTicketList('active')
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
          _goHome={this._goHome}
          _goCompany={this._goCompany}
          _goTicketList={this._goTicketList}
          />
        <section className="main-content-wrapper">
          <PageHeader
            pageSection={this.state.pageSection}
            pageTitle={this.state.pageTitle}
            _goHome={this._goHome}
            />
          <section id="main-content" className="animated fadeInUp">
            {this.state.subComponent}
            {this.state.mainComponent}
            <CustomerList 
              ref="customer_list"
              key="customers"
              customerId={this.state.customerId}
              _goCustomer={this._goCustomer} 
              customers={this.state.customers}
              customer={this.state.customer}
              loadCustomers={this.loadCustomers}
              handleSearch={this.handleSearch}
              searchWord={this.state.searchWord}
              pagination={this.state.customerPagination}
              currentPage={this.state.customerPage}
              hideCustomerList={this.hideCustomerList}
            />
          </section>
        </section>
      </section>
    );
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
  handleSearch: function(e){
    this.setState({searchWord: e.target.value});
    if (this.state.searchTimer == null){
      this.setState({searchTimer: setTimeout(this.loadCustomers, 800)});
    }
  },
  handlePageHistory: function(title, url){
    document.title = title;
    window.history.replaceState({"pageTitle":title},'', url);
    this.setState({pageTitle: title})
  },
  
  //Faux Routing
  _goHome: function(){
    //this.setState({pageTitle: null, mainComponent: <Home config={this.state.config} />});
    this._goTicketList('active');
    this.handlePageHistory('Home', '/crm');
  },
  _goTicketList: function(status){
    console.log('go ticket list - ' + status)
    this.setState({mainComponent: <TicketList _goTicket={this._goTicket} config={this.state.config} status={status} />});
    this.setState({status: status, pageTitle: `${status.charAt(0).toUpperCase() + status.slice(1)} Tickets`});
  },
  _goTicket: function(ticketId){
    this.setState({subComponent: <TicketShowContainer ticketId={ticketId} config={this.state.config} handlePageHistory={this.handlePageHistory} />});
  },
  _goCompany: function(companyId){
    this.setState({mainComponent: <CompanyShowContainer companyId={companyId} config={this.state.config} handlePageHistory={this.handlePageHistory} _goTicket={this._goTicket} />})
  },
  _goCustomer: function(customerId){
    this.setState({mainComponent: <CustomerShowContainer customerId={customerId} config={this.state.config} handlePageHistory={this.handlePageHistory} _goTicket={this._goTicket} />})
  }
});