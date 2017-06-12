/*
  global React
  global $
  global ReactDOM
*/
var Search = React.createClass({
  getInitialState: function(){
    return({
      searchWord: null,
      searchType: 'email',
      loading: false
    });  
  },
  handleSearchWord: function(e){
    this.setState({searchWord: e.target.value});
    this.props.sgs('searchWord', e.target.value);
  },
  render: function(){
    return(
      <div className="well well-sm">
        <form onSubmit={this.doSearch}>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Keyword..." ref="keyword" onChange={this.handleSearchWord} />
              </div>
              <div className="form-group">
                <div className="btn-group">
                  {this.searchTypeButton('Emails', 'email')}
                  {this.searchTypeButton('Tasks', 'task')}
                  {this.searchTypeButton('Notes', 'normal')}
                  {this.searchTypeButton('Customers', 'customer')}
                  {this.searchTypeButton('Companies', 'company')}
                </div>
              </div>
              {this.searchButton()}
            </div>
          </div>
        </form>
      </div>
    );
  },
  searchTypeButton: function(title, type){
    var displayButton=true;
    console.log(this.props.gs.config.functions.indexOf('companies'))
    if (type=='task' && this.props.gs && this.props.gs.config && this.props.gs.config.functions.indexOf('tasks')<=-1){
      displayButton=false;
    }else if (type=='company' && this.props.gs && this.props.gs.config && this.props.gs.config.functions.indexOf('companies')<=-1){
      displayButton=false;
    }
    if (displayButton){
      return(
        <button className={`btn btn-${type==this.state.searchType ? 'info' : 'default'} btn-sm`} data-type={type} onClick={this.changeSearchType}>{title}</button>
      );
    }
  },
  searchButton: function(){
    if (this.state.searchWord){
      return(
        <div className="form-group no-margin">
          <button className="btn btn-primary">
            <i className={`fa fa-fw fa-${this.loadingIcon()}`} /> Search
          </button>
        </div>
      );
    }
  },
  changeSearchType: function(e){
    this.setState({searchType: $(e.target).attr('data-type')});
  },
  doSearch: function(e){
    e.preventDefault();
    var _this=this;
    var keyword = ReactDOM.findDOMNode(this.refs.keyword).value;
    if (keyword){
      this.props.sgs('searchWord', keyword);
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
          if (data.type=='email'||data.type=='task'||data.type=='normal'){
            _this.props._goTicketSearch(data.type, '');
          }else if (data.type=='customer'){
            _this.props._goCustomerSearch();
          }else if (data.type=='company'){
            _this.props._goCompanySearch();
          }
        }
      });
    }
  },
  loadingIcon: function(){
    if (this.state.loading){
      return('refresh fa-spin');
    }else{
      return('search');
    }
  }
});