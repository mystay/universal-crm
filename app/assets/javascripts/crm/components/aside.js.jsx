var Aside = React.createClass({
  
  home: function(){
    $("#customer_summary").hide();
    this.props.setCustomerId(null);
    this.props.setTicketId(null);
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
              <a style={{cursor: 'pointer'}} onClick={this.props.loadPriorityTickets}>
                <i className="fa fa-flag fa-fw" />
                Priority
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.props.loadActiveTickets}>
                <i className="fa fa-folder-open fa-fw" />
                Open
              </a>
            </li>
            <li>
              <a style={{cursor: 'pointer'}} onClick={this.props.loadClosedTickets}>
                <i className="fa fa-check fa-fw" />
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