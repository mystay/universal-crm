var CRM = React.createClass({
  getInitialState: function(){
    return {
      gs: {},
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
        _this.setGlobalState('config', data);
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
          gs={this.state.gs}
          sgs={this.setGlobalState}
          username={this.props.username}
          loadCustomers={this.loadCustomers}
          handleSearch={this.handleSearch}
          _goCustomerList={this._goCustomerList}
          />
        <Aside
          gs={this.state.gs}
          sgs={this.setGlobalState}
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
            <pre>{JSON.stringify(this.state.gs)}</pre>
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
  setGlobalState: function(key, value){
    console.log(key)
    console.log(value)
    var globalState = this.state.gs;
    globalState[key] = value;
    this.setState({gs: globalState});
  },
  //Faux Routing
  _setMainComponent: function(comp){
    this.setState({mainComponent: comp});
  },
  _goHome: function(){
    //this.setState({pageTitle: null, mainComponent: <Home gs={this.state.globalState} sgs={this.setGlobalState} />});
    this._goTicketList('active');
    this.handlePageHistory('Home', '/crm');
  },
  _goTicketList: function(status){
    this.setState({mainComponent: <TicketList _goTicket={this._goTicket} gs={this.state.globalState} sgs={this.setGlobalState} status={status} _goCustomer={this._goCustomer} />});
    this.setState({status: status, pageTitle: `${status.charAt(0).toUpperCase() + status.slice(1)} Tickets`});
  },
  _goTicket: function(ticketId){
    this.setState({mainComponent: <TicketShowContainer ticketId={ticketId} gs={this.state.globalState} sgs={this.setGlobalState} handlePageHistory={this.handlePageHistory} _goCustomer={this._goCustomer} />});
  },
  _goCompany: function(companyId){
    this.setState({mainComponent: <CompanyShowContainer companyId={companyId} gs={this.state.globalState} sgs={this.setGlobalState} handlePageHistory={this.handlePageHistory} _goTicket={this._goTicket} _goCompany={this._goCompany} />})
  },
  _goCustomer: function(customerId){
    this.setState({mainComponent: <CustomerShowContainer customerId={customerId} gs={this.state.globalState} sgs={this.setGlobalState} handlePageHistory={this.handlePageHistory} _goTicket={this._goTicket} _goCustomer={this._goCustomer} />})
  },
  _goCustomerList: function(searchWord){
    this.setState({mainComponent: <CustomerList _goCustomer={this._goCustomer} gs={this.state.globalState} sgs={this.setGlobalState} searchWord={searchWord} />});
  },
});