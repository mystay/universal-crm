/*
  global React
  global $
  global ReactDOM
*/
window.Search = createReactClass({
  getInitialState: function(){
    return({
      searchWord: null,
      searchType: 'email',
      loading: false,
      countries: [],
      country: null,
      addressState: null,
      customerCompanyID: null,
      customerCompanyName: null
    });
  },
  componentDidMount: function(){
    var _this=this;
    $.ajax({
      url: 'countries.json', 
      type: 'GET',
      success: function(d){
        _this.setState({countries: d.countries});
      }
    });
    this.props.sgs('country', '');
  },
  componentDidUpdate: function(){
    if (this.state.searchType == 'customer') {
      var _this=this;
      var customerCompanySearch = ReactDOM.findDOMNode(this.refs.customerCompany);
      $(customerCompanySearch).autocomplete({
        source: `/crm/companies/autocomplete`,
        monLength: 3,
        autoFocus: false,
        delay: 400,
        select: function(e, ui){
          e.preventDefault();
          customerCompanySearch.value = ui.item.label;
          _this.setState({customerCompanyID: ui.item.value, customerCompanyName: ui.item.label});
          _this.props.sgs('customerCompanyID', ui.item.value);
        },
        focus: function(e,ui){
          e.preventDefault();
          _this.setState({customerCompanyID: null, customerCompanyName: null});
          _this.props.sgs('customerCompanyID', null);
        }
      });
    }
  },
  searchFields: function(){
    switch(this.state.searchType){
      case "email":
        return(
          this.keywordSearch()
        )
      case "task":
        return(
          this.keywordSearch()
        )
      case "note":
        return(
          this.keywordSearch()
        )
      case "customer":
        return(
          <div>
            {this.customerCompanySearch()}
            {this.keywordSearch()}
          </div>
        )
      case "company":
        return(
          <div>
            {this.countrySelect()}
            {this.addressStateSearch()}
            {this.keywordSearch()}
          </div>
        )
    }
  },
  customerCompanySearch: function(){
    return(
      <div className="form-group">
        <input type="text" className="form-control" placeholder="Company..." ref="customerCompany" onChange={this.handleCustomerCompanySearch} />
      </div>
    )
  },
  keywordSearch: function(){
    return(
      <div className="form-group">
        <input type="text" className="form-control" placeholder="Keyword..." ref="keyword" onChange={this.handleSearchWord} />
      </div>
    );
  },
  countrySelect: function(){
    var countries = this.state.countries
    if (countries){
      var u = [];
      for (var i=0;i<countries.length;i++){
        var country = countries[i];
        u.push(<option key={country.id} value={country.id}>{country.name}</option>);
      }
      return(
        <div className="form-group">
          <select className="form-control" onChange={this.handleCountry}><option value=''>Country (Optional)</option>{u}</select>
        </div>
      )
    }
  },
  addressStateSearch: function(){
    if (this.state.country != null && this.state.country != ""){
      return(
        <div className="form-group">
          <input type="text" className="form-control" placeholder="State..." ref="addressState" onChange={this.handleAddressState} />
        </div>
      );
    }
  },
  nullifyState: function(value){
    this.props.sgs(value, null);
    this.setState({value: null});
  },
  handleCountry: function(e){
    this.setState({country: e.target.value})
    this.props.sgs('country', e.target.value);
    this.nullifyState('addressState')
  },
  handleCustomerCompanySearch: function(e){
    this.setState({customerCompanyID: null, customerCompanyName: null});
    this.props.sgs('customerCompanyID', null);
  },
  handleAddressState: function(e){
    this.setState({addressState: e.target.value});
    this.props.sgs('addressState', e.target.value);
  },
  handleSearchWord: function(e){
    this.setState({searchWord: e.target.value});
    this.props.sgs('searchWord', e.target.value);
  },
  handleType: function(e){
    e.preventDefault();
    this.setState({searchType: $(e.target).attr('data-type')});
  },
  searchTypeButton: function(title, type){
    var displayButton=true;
    if (type=='task' && this.props.gs && this.props.gs.config && this.props.gs.config.functions.indexOf('tasks')<=-1){
      displayButton=false;
    }else if (type=='company' && this.props.gs && this.props.gs.config && this.props.gs.config.functions.indexOf('companies')<=-1){
      displayButton=false;
    }
    if (displayButton){
      return(
        <button className={`btn btn-${type==this.state.searchType ? 'info' : 'default'} btn-sm`} data-type={type} onClick={this.handleType}>{title}</button>
      );
    }
  },
  searchButton: function(){
    return(
      <div className="form-group no-margin">
        <button className="btn btn-primary">
          <i className={`fa fa-fw fa-${this.loadingIcon()}`} /> Search
        </button>
      </div>
    );
  },
  doSearch: function(e){
    e.preventDefault();
    var _this=this;
    var keyword = ReactDOM.findDOMNode(this.refs.keyword).value;
    var address_state = ReactDOM.findDOMNode(this.refs.addressState)
    this.props.sgs('searchWord', keyword);
    if (address_state) {this.props.sgs('addressState', address_state.value);}
    this.setState({loading: true});
    $.ajax({
      type: 'GET',
      url: '/crm/search',
      data: {
        keyword: keyword,
        search_type: this.state.searchType
      },
      success: function(data){
        _this.setState({loading: false});
        if (data.type=='email'||data.type=='task'||data.type=='note'){
          _this.props._goTicketSearch(data.type, '');
        }else if (data.type=='customer'){
          _this.props._goCustomerSearch();
        }else if (data.type=='company'){
          _this.props._goCompanySearch();
        }
      }
    });
  },
  loadingIcon: function(){
    if (this.state.loading){
      return('refresh fa-spin');
    }else{
      return('search');
    }
  },
  render: function(){
    return(
      <div className="well well-sm">
        <form onSubmit={this.doSearch}>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <div className="btn-group">
                  {this.searchTypeButton('Emails', 'email')}
                  {this.searchTypeButton('Tasks', 'task')}
                  {this.searchTypeButton('Notes', 'note')}
                  {this.searchTypeButton('Customers', 'customer')}
                  {this.searchTypeButton('Companies', 'company')}
                </div>
              </div>
              {this.searchFields()}
              {this.searchButton()}
            </div>
          </div>
        </form>
      </div>
    );
  }
});
