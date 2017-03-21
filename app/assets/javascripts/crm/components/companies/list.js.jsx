/*
  global React
  global $
*/
var CompanyList = React.createClass({
  getInitialState: function(){
    return({
      companies: null,
      loading: false,
      companyPagination: null,
      companyPage: null,
      pastProps: null
    });
  },
  init: function(){
    this.loadCompanies(this.props.gs.searchWord);
  },
  componentDidMount: function(){
    this.init();
  },
  componentDidUpdate: function(){
    if (this.state.pastProps != this.props && !this.state.loading){
      this.init();
    }
  },
  clickCompany: function(e){
    this.props._goCompany(e.target.id);
  },  
  loadCompanies: function(searchWord, page){
    if (!this.state.loading){
      this.setState({loading: true, pastProps: this.props});
      if (page==undefined){page=1;}
      if (searchWord==undefined){searchWord='';}
      var _this=this;
      return $.ajax({
        method: 'GET',
        url: `/crm/companies?q=${searchWord}&page=${page}`,
        success: function(data){
          _this.setState({
            loading: false,
            companies: data.companies,
            companyPagination: data.pagination,
            companyPage: page
          });
          _this.props.sgs('searching', false);
        }
      });
    }
  },
  hidecompanyList: function(){
    
  },
  companyStateCountry: function(address){
    var items = []
    if (address.state){items.push(address.state);}
    if (address.country_code){items.push(address.country_code);}
    return items.join(', ');
  },
  companyList: function(){
    var rows = [];
    for (var i=0;i<this.state.companies.length;i++){
      var company = this.state.companies[i];
      var badgeCount;
      var companyStateCountry = this.companyStateCountry(company.address);
      if (company.ticket_count>0){
        badgeCount = <span className="badge badge-warning" style={{fontSize: '12px', backgroundColor: '#ffab40'}}>{company.ticket_count}</span>;
      }else{
        badgeCount = <span></span>;
      }
      rows.push(
        <tr key={company.id}>
          <td><a id={company.id} onClick={this.clickCompany} style={{cursor: 'pointer'}}>{company.name}</a></td>
          <td>{company.email}</td>
          <td>{companyStateCountry}</td>
          <td className="text-center">{company.employees.length}</td>
          <td>{badgeCount}</td>
        </tr>
      );
    }
    return rows;
  },
  pageResults: function(page){
    this.props.loadCompanies(page);
    this.setState({currentPage: page});
  },
  render: function(){
    if (this.state.companies && this.state.companies.length>0){
      return(
        <div className="panel panel-warning">
          <div className="panel-heading">
            <h3 className="panel-title">Companies</h3>
          </div>
          <div className="panel-body">
            <table className="table table-striped table-condensed">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>State, Country</th>
                  <th>Employees</th>
                  <th>Open Tickets</th>
                </tr>
              </thead>
              <tbody>
                {this.companyList()}
              </tbody>
            </table>
            <Pagination
              pagination={this.props.pagination}
              currentPage={this.props.currentPage}
              pageResults={this.pageResults}
              displayDescription={false} />
          </div>
        </div>
      );
    }else{
      return(null);
    }
  }
  
});