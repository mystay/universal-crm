var CRM = React.createClass({
  getInitialState: function(){
    return {
      gs: {},
      customer: null,
      searchTimer: null,
      customerPagination: null,
      ticketPage: 1,
      customerPage: 1,
      mainComponent: 'Loading...',
      subComponent: null
    };
  },
  componentDidMount: function(){
    var _this = this;
    $.ajax({
      method: 'GET',
      url: `/crm/config.json`,
      success: (function(data){
        _this.setGlobalState('config', data);
        _this.init(_this);
      })
    });
  },
  init: function(_this){
    if (_this.props.customerId){
      window.setTimeout(function(){_this._goCustomer(_this.props.customerId);}, 1000);
    }else if (_this.props.companyId){
      window.setTimeout(function(){_this._goCustomer(_this.props.companyId);}, 1000);
    }else if (_this.props.ticketId){
      window.setTimeout(function(){_this._goTicket(_this.props.ticketId);}, 1000);
    }else{
      window.setTimeout(function(){_this._goTicketList('email');}, 1000);
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
            gs={this.state.gs}
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
  customerDidLoad: function(customer){
    this.setGlobalState('pageTitle', customer.name);
    this.handlePageHistory(customer.name, `/crm/customer/${customer.id}`);
  },
  handlePageHistory: function(title, url){
    document.title = title;
    window.history.replaceState({"pageTitle":title},'', url);
    this.setGlobalState('pageTitle', title);
  },
  setGlobalState: function(key, value){
    var globalState = this.state.gs;
    globalState[key] = value;
    this.setState({gs: globalState});
  },
  //Faux Routing
  _setMainComponent: function(comp){
    this.setState({mainComponent: comp});
  },
  _goHome: function(){
    //this.setState({pageTitle: null, mainComponent: <Home gs={this.state.gs} sgs={this.setGlobalState} />});
    this._goTicketList('active');
    this.handlePageHistory('Home', '/crm');
  },
  _goTicketList: function(status){
    this.setState({mainComponent: <TicketList _goTicket={this._goTicket} gs={this.state.gs} sgs={this.setGlobalState} status={status} _goCustomer={this._goCustomer} />});
    var title = `${status.charAt(0).toUpperCase() + status.slice(1)} Tickets`;
    this.setGlobalState('ticketStatus', status);
    this.setGlobalState('pageTitle', title);
    this.handlePageHistory(title, `/crm/${status}`);
  },
  _goTicket: function(ticketId){
    this.setState({mainComponent: <TicketShowContainer ticketId={ticketId} gs={this.state.gs} sgs={this.setGlobalState} handlePageHistory={this.handlePageHistory} _goCustomer={this._goCustomer} />});
  },
  _goCompany: function(companyId){
    this.setState({mainComponent: <CompanyShowContainer companyId={companyId} gs={this.state.gs} sgs={this.setGlobalState} handlePageHistory={this.handlePageHistory} _goTicket={this._goTicket} _goCompany={this._goCompany} />})
  },
  _goCustomer: function(customerId){
    this.setState({mainComponent: <CustomerShowContainer customerId={customerId} gs={this.state.gs} sgs={this.setGlobalState} handlePageHistory={this.handlePageHistory} _goTicket={this._goTicket} _goCustomer={this._goCustomer} />})
  },
  _goCustomerList: function(searchWord){
    this.setState({mainComponent: <CustomerList _goCustomer={this._goCustomer} gs={this.state.gs} sgs={this.setGlobalState} />});
  },
});