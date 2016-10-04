var CRM = React.createClass({
  getInitialState: function(){
    return {
      config: null,
      //customerId: null,
      customer: null,
      searchWord: '',
      searchTimer: null,
      customerPagination: null,
      ticketPage: 1,
      customerPage: 1,
      pageTitle: null,
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
          _goCustomerList={this._goCustomerList}
          />
        <Aside
          _goHome={this._goHome}
          _goCompany={this._goCompany}
          _goTicketList={this._goTicketList}
          />
        <section className="main-content-wrapper">
          <PageHeader
            pageTitle={this.state.pageTitle}
            _goHome={this._goHome}
            />
          <section id="main-content" className="animated fadeInUp">
            {this.state.subComponent}
            {this.state.mainComponent}
          </section>
        </section>
      </section>
    );
  },
  /*setCustomerId: function(id){
    if (id==null){
      $("#customer_list").show();
      this.setState({pageTitle: null, customer: null});
    }
    this.setState({customerId: id});
    this.loadTickets(id, 'all');
  },*/
  customerDidLoad: function(customer){
    this.setState({pageTitle: customer.name});
    this.handlePageHistory(customer.name, `/crm/customer/${customer.id}`);
  },
  handlePageHistory: function(title, url){
    document.title = title;
    window.history.replaceState({"pageTitle":title},'', url);
    this.setState({pageTitle: title})
  },
  
  //Faux Routing
  _setMainComponent: function(comp){
    this.setState({mainComponent: comp});
  },
  _goHome: function(){
    //this.setState({pageTitle: null, mainComponent: <Home config={this.state.config} />});
    this._goTicketList('active');
    this.handlePageHistory('Home', '/crm');
  },
  _goTicketList: function(status){
    this.setState({mainComponent: <TicketList _goTicket={this._goTicket} config={this.state.config} status={status} _goCustomer={this._goCustomer} />});
    this.setState({status: status, pageTitle: `${status.charAt(0).toUpperCase() + status.slice(1)} Tickets`});
  },
  _goTicket: function(ticketId){
    this.setState({mainComponent: <TicketShowContainer ticketId={ticketId} config={this.state.config} handlePageHistory={this.handlePageHistory} _goCustomer={this._goCustomer} />});
  },
  _goCompany: function(companyId){
    this.setState({mainComponent: <CompanyShowContainer companyId={companyId} config={this.state.config} handlePageHistory={this.handlePageHistory} _goTicket={this._goTicket} _goCompany={this._goCompany} />})
  },
  _goCustomer: function(customerId){
    this.setState({mainComponent: <CustomerShowContainer customerId={customerId} config={this.state.config} handlePageHistory={this.handlePageHistory} _goTicket={this._goTicket} _goCustomer={this._goCustomer} />})
  },
  _goCustomerList: function(searchWord){
    this.setState({mainComponent: <CustomerList _goCustomer={this._goCustomer} searchWord={searchWord} />});
  },
});