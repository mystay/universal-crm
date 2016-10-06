var Aside = React.createClass({
  
  home: function(){
    this.props._goHome();
  },
  loadPriorityTickets: function(){
    this.props._goTicketList('priority');
  },
  loadActiveTickets: function(){
    this.props._goTicketList('active');
  },
  loadActionedTickets: function(){
    this.props._goTicketList('actioned');
  },
  loadClosedTickets: function(){
    this.props._goTicketList('closed');
  },
  render: function(){
    return(
      <aside className="sidebar sidebar-left">
        <nav>
          <h5 className="sidebar-header">Tickets</h5>
          <ul className="nav nav-pills nav-stacked">
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.home}>
                <i className="fa fa-home fa-fw" />
                Home
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadPriorityTickets}>
                <i className="fa fa-flag fa-fw" />
                Priority
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadActiveTickets}>
                <i className="fa fa-folder-open fa-fw" />
                Open
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadActionedTickets}>
                <i className="fa fa-check fa-fw" />
                Actioned
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadClosedTickets}>
                <i className="fa fa-ban fa-fw" />
                Closed
              </a>
            </li>
          </ul>
          <h5 className="sidebar-header">Customers</h5>
          <ul className="nav nav-pills nav-stacked">
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.displayNewCustomer}>
                <i className="fa fa-plus fa-fw" />
                New
              </a>
            </li>
          </ul>
          <RecentCompanies _goCompany={this.props._goCompany} gs={this.props.gs} sgs={this.props.sgs} />
        </nav>
        <Modal ref='new_customer_modal' modalTitle="New Customer" modalContent={<NewCustomer />} />
      </aside>
    )
  },
  displayNewCustomer: function(){
    var modal = ReactDOM.findDOMNode(this.refs.new_customer_modal);
    if (modal){
      $(modal).modal('show', {backdrop: 'static'});
    }
  }  
})