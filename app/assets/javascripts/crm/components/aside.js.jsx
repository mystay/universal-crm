/*
  global React
  global ReactDOM
  global $
*/
var Aside = React.createClass({
  dashboard: function(){
    this.props._goDashboard();
  },
  loadTickets: function(e){
    this.props._goTicketList($(e.target).attr('data-status'), null, null);
    var title = $(e.target).attr('data-title');
    if (title){
      this.props.sgs('pageTitle', title);
    }
    var icon = $(e.target).attr('data-icon');
    if (icon){
      this.props.sgs('pageIcon', icon);
    }
  },
  loadFlaggedTickets: function(e){
    this.props._goTicketList(null, $(e.target).attr('data-flag'));
  },
  render: function(){
    return(
      <aside className="sidebar sidebar-left">
        <nav>
          <h5 className="sidebar-header">Tickets</h5>
          <ul className="nav nav-pills nav-stacked">
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.dashboard}>
                <i className="fa fa-dashboard fa-fw" />
                Dashboard
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadTickets} data-status='email' data-title="Emails" data-icon="fa-envelope">
                <i className="fa fa-envelope fa-fw" />
                Emails
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadTickets} data-status='task' data-title="Tasks" data-icon="fa-check-circle">
                <i className="fa fa-check-circle fa-fw" />
                Tasks
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadTickets} data-status='normal' data-title="Notes" data-icon="fa-sticky-note">
                <i className="fa fa-sticky-note fa-fw" />
                Notes
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadTickets} data-status='active' data-title="All Open Tickets" data-icon="fa-folder-open">
                <i className="fa fa-folder-open fa-fw" />
                All Open Tickets
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadTickets} data-status='actioned' data-title="Actioned" data-icon="fa-check">
                <i className="fa fa-check fa-fw" />
                Actioned
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadTickets} data-status='closed' data-title="Closed" data-icon="fa-ban">
                <i className="fa fa-ban fa-fw" />
                Closed
              </a>
            </li>
            {this.flagLinks()}
          </ul>
          <h5 className="sidebar-header">Customers</h5>
          <ul className="nav nav-pills nav-stacked">
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.displayNewCustomer}>
                <i className="fa fa-plus fa-fw" />
                New
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.props._goCustomerList}>
                <i className="fa fa-list fa-fw" />
                List
              </a>
            </li>
          </ul>
          {this.companiesMenu()}
        </nav>
        <Modal ref='new_customer_modal' modalTitle="New Customer" modalContent={<NewCustomer />} />
        <Modal ref='new_company_modal' modalTitle="New Company" modalContent={<NewCompany />} />
      </aside>
    );
  },
  displayNewCustomer: function(){
    var modal = ReactDOM.findDOMNode(this.refs.new_customer_modal);
    if (modal){
      $(modal).modal('show', {backdrop: 'static'});
    }
  },
  displayNewCompany: function(){
    var modal = ReactDOM.findDOMNode(this.refs.new_company_modal);
    if (modal){
      $(modal).modal('show', {backdrop: 'static'});
    }
  },
  companiesMenu: function(){
    if (this.props.gs && this.props.gs.config && this.props.gs.config.companies){
      return(<div>
        <h5 className="sidebar-header">Companies</h5>
        <ul className="nav nav-pills nav-stacked">
          <li>
            <a style={{cursor: 'pointer'}} onClick={this.displayNewCompany}>
              <i className="fa fa-plus fa-fw" />
              New
            </a>
          </li>
          <li>
            <a style={{cursor: 'pointer'}} onClick={this.props._goCompanyList}>
              <i className="fa fa-list fa-fw" />
              List
            </a>
          </li>
        </ul>
        </div>
      );
    }
  },
  flagLinks: function(){
    if (this.props.gs && this.props.gs.config){
      var h = [];
      for (var i=0;i<this.props.gs.config.ticket_flags.length;i++){
        var flag = this.props.gs.config.ticket_flags[i];
        h.push(
          <li key={flag['label']}>
            <a onClick={this.loadFlaggedTickets} data-flag={flag['label']} style={{cursor: 'pointer'}}>
              <i className="fa fa-fw fa-tag" style={{color: `#${flag['color']}`}} data-flag={flag['label']} /> {flag['label']}
            </a>
          </li>
        );
      }
      return(h);
    }
  }
})