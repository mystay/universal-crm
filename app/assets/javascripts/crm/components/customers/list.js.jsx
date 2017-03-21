/*
global React
global $
*/
var CustomerList = React.createClass({
  getInitialState: function(){
    return({
      customers: null,
      loading: false,
      pagination: null,
      pageNum: null,
      pastProps: null,
      searchWord: null
    });
  },
  init: function(){
    this.loadCustomers(this.props.gs.searchWord);
  },
  componentDidMount: function(){
    this.init();
  },
  componentDidUpdate: function(){
    if (this.state.pastProps != this.props && !this.state.loading){
      this.init();
    }
  },
  clickCustomer: function(e){
    this.props.sgs('searchWord', '');
    this.props._goCustomer($(e.target).attr('data-id'));
  },  
  loadCustomers: function(searchWord, page){
    if (!this.state.loading){
      this.setState({loading: true, pastProps: this.props, searchWord: searchWord});
      if (page==undefined){page=1;}
      if (searchWord==undefined){searchWord='';}
      var _this=this;
      return $.ajax({
        method: 'GET',
        url: `/crm/customers?q=${searchWord}&page=${page}`,
        success: function(data){
          _this.setState({
            loading: false,
            customers: data.customers,
            pagination: data.pagination,
            pageNum: page
          });
          _this.props.sgs('searching', false);
        }
      });
    }
  },
  hideCustomerList: function(){
    
  },
  customerList: function(){
    var rows = [];
    for (var i=0;i<this.state.customers.length;i++){
      var customer = this.state.customers[i];
      var badgeCount, draftBadge;
      if (customer.ticket_count>0){
        badgeCount = <span className="badge badge-warning" style={{fontSize: '12px', backgroundColor: '#ffab40'}}>{customer.ticket_count}</span>;
      }else{
        badgeCount=null;
      }
      if (customer.status=='draft'){
        draftBadge = <span className="badge badge-danger" style={{marginRight: '10px'}}>Draft</span>;
      }else{
        draftBadge = null;
      }
      rows.push(
        <tr key={customer.id}>
          <td>{draftBadge}<a data-id={customer.id} onClick={this.clickCustomer} style={{cursor: 'pointer'}}>{customer.name}</a></td>
          <td className="small"><a data-id={customer.id} onClick={this.clickCustomer} style={{cursor: 'pointer'}}>{customer.email}</a></td>
          <td className="text-center">{badgeCount}</td>
        </tr>
      );
    }
    return rows;
  },
  pageResults: function(page){
    this.loadCustomers(this.state.searchWord, page);
    this.setState({currentPage: page});
  },
  render: function(){
    if (this.state.customers && this.state.customers.length>0){
      return(
        <div className="panel panel-warning">
          <div className="panel-heading">
            <h3 className="panel-title">Customers</h3>
          </div>
          <div className="panel-body">
            <table className="table table-striped table-condensed">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Open Tickets</th>
                </tr>
              </thead>
              <tbody>
                {this.customerList()}
              </tbody>
            </table>
            <Pagination
              pagination={this.state.pagination}
              currentPage={this.state.pageNum}
              pageResults={this.pageResults}
              displayDescription={true} />
          </div>
        </div>
      );
    }else{
      return(null);
    }
  }
  
});