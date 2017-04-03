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
              <a style={{cursor: 'pointer'}} onClick={this.loadTickets} data-status='email'>
                <i className="fa fa-envelope fa-fw" data-status='email' />
                Inbox
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadTickets} data-status='active'>
                <i className="fa fa-folder-open fa-fw" data-status='active' />
                Open
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadTickets} data-status='actioned'>
                <i className="fa fa-exclamation-triangle fa-fw" data-status='actioned' />
                Follow up
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.loadTickets} data-status='closed'>
                <i className="fa fa-ban fa-fw" data-status='closed' />
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
          </ul>
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
  },
  flagLinks: function(){
    if (this.props.gs && this.props.gs.config){
      var h = []
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