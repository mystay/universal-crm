var CustomerList = React.createClass({
  getInitialState: function(){
    return({
      searchWord: null,
      customers: null,
      loading: false,
      customerPagination: null,
      customerPage: null
    });
  },
  componentDidMount: function(){
    this.loadCustomers();
  },
  componentDidUpdate: function(){
    if (this.props.gs != null && this.props.gs.searchWord != null && this.props.gs.searchWord != this.state.searchWord && !this.state.loading){
      
      this.loadCustomers(this.props.gs.searchWord);
    }
  },
  clickCustomer: function(e){
    this.props._goCustomer(e.target.id);
  },  
  loadCustomers: function(searchWord, page){
    if (!this.state.loading){
      this.setState({loading: true, searchWord: searchWord});
      if (page==undefined){page=1;}
      if(searchWord==''){
        this.setState({customers: []});
        this.hideCustomerList();
      }else{
        var _this=this;
        return $.ajax({
          method: 'GET',
          url: `/crm/customers?q=${searchWord}&page=${page}`,
          success: function(data){
            return _this.setState({
              loading: false,
              customers: data.customers,
              customerPagination: data.pagination,
              customerPage: page
            });
          }
        });
      }
    }
  },
  hideCustomerList: function(){
    
  },
  customerList: function(){
    var rows = []
    for (var i=0;i<this.state.customers.length;i++){
      var customer = this.state.customers[i];
      var badgeCount;
      if (customer.ticket_count>0){
        badgeCount = <span className="badge badge-warning" style={{fontSize: '12px', backgroundColor: '#ffab40'}}>{customer.ticket_count}</span>
      }else{
        badgeCount = <span></span>
      }
      rows.push(
        <div className="col-sm-3" key={customer.id}>
          <div className="panel" style={{maxHeight: '70px'}}>
            <div className="panel-body">
              <div className="pull-right">{badgeCount}</div>
              <div className="pull-left"><i className="fa fa-user fa-fw fa-2x text-muted" /></div>
              <h4 id={customer.id} onClick={this.clickCustomer} style={{cursor: 'pointer'}}>{customer.name}</h4>
              <p className="text-info" style={{overflow: 'hidden', width:'80%', fontSize: '0.7em'}}>{customer.email}</p>
            </div>
          </div>
        </div>
      );
    }
    return rows;
  },
  pageResults: function(page){
    this.props.loadCustomers(page)
    this.setState({currentPage: page})
  },
  render: function(){
    if (this.state.customers && this.state.customers.length>0){
      return(
        <div className="panel panel-warning">
          <div className="panel-heading">
            <h3 className="panel-title">Customers</h3>
            <div className="actions pull-right">
              <i className="fa fa-times" onClick={this.props.hideCustomerList}/>
            </div>
          </div>
          <div className="panel-body">
            <div className="row">{this.customerList()}</div>
            <Pagination
              pagination={this.props.pagination}
              currentPage={this.props.currentPage}
              pageResults={this.pageResults}
              displayDescription={false} />
          </div>
        </div>
      )
    }else{
      return(null);
    }
  }
  
});