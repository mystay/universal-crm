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
  clickcompany: function(e){
    this.props._gocompany(e.target.id);
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
  companyList: function(){
    var rows = []
    for (var i=0;i<this.state.companies.length;i++){
      var company = this.state.companies[i];
      var badgeCount;
      if (company.ticket_count>0){
        badgeCount = <span className="badge badge-warning" style={{fontSize: '12px', backgroundColor: '#ffab40'}}>{company.ticket_count}</span>
      }else{
        badgeCount = <span></span>
      }
      rows.push(
        <div className="col-sm-3" key={company.id}>
          <div className="panel" style={{maxHeight: '70px'}}>
            <div className="panel-body">
              <div className="pull-right">{badgeCount}</div>
              <div className="pull-left"><i className="fa fa-user fa-fw fa-2x text-muted" /></div>
              <h4 id={company.id} onClick={this.clickcompany} style={{cursor: 'pointer'}}>{company.name}</h4>
              <p className="text-info" style={{overflow: 'hidden', width:'80%', fontSize: '0.7em'}}>{company.email}</p>
            </div>
          </div>
        </div>
      );
    }
    return rows;
  },
  pageResults: function(page){
    this.props.loadCompanies(page)
    this.setState({currentPage: page})
  },
  render: function(){
    if (this.state.companies && this.state.companies.length>0){
      return(
        <div className="panel panel-warning">
          <div className="panel-heading">
            <h3 className="panel-title">companies</h3>
            <div className="actions pull-right">
              <i className="fa fa-times" onClick={this.props.hidecompanyList}/>
            </div>
          </div>
          <div className="panel-body">
            <div className="row">{this.companyList()}</div>
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