var CustomerList = React.createClass({
  loadCustomer: function(e){
    this.props.setCustomerId(e.target.id);
  },
  customerList: function(){
    var rows = []
    for (var i=0;i<this.props.customers.length;i++){
      var customer = this.props.customers[i];
      var badgeCount;
      if (customer.ticket_count>0){
        badgeCount = <span className="badge badge-warning" style={{fontSize: '12px', backgroundColor: '#ffab40'}}>{customer.ticket_count}</span>
      }else{
        badgeCount = <span></span>
      }
      rows.push(
        <li className="list-group-item" key={customer.id} style={{cursor: 'pointer'}}>
          {badgeCount}
          <h4 className="list-group-item-heading" id={customer.id} onClick={this.loadCustomer}>{customer.name}</h4>
          <p className="list-group-item-text">{customer.email}</p>
        </li>
      );
    }
    return rows;
  },
  pageResults: function(page){
    this.props.loadCustomers(page)
    this.setState({currentPage: page})
  },
  render: function(){
    if (this.props.customers.length==0){
      return(
        <div className="alert alert-warning">No customers to list</div>
      )
    }else{
      return(
        <div>
          <div className="card">
            <ul className="list-group">
              {this.customerList()}
            </ul>
          </div>
          <Pagination
            pagination={this.props.pagination}
            currentPage={this.props.currentPage}
            pageResults={this.pageResults}
            displayDescription={false} />
        </div>
      )
    }
  }
  
});