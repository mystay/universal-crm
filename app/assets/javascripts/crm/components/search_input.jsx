var SearchInput = React.createClass({
  getInitialState: function(){
    return({
      searchWord: null,
      searchTimer: null
    });
  },
  handleSearch: function(e){
    e.preventDefault();
    if (this.state.searchTimer == null){
      this.props.sgs('searching', true);
      this.setState({searchTimer: setTimeout(this.loadSearch, 800)});
      var input = ReactDOM.findDOMNode(this.refs.search_input);
      input.value='';
    }
  },
  handleSearchWord: function(e){
    this.setState({searchWord: e.target.value});
    this.props.sgs('searchWord', e.target.value);
  },
  loadSearch: function(){
    this.props._goSearch(this.state.searchWord);
    this.setState({searchTimer: null});
  },
  render: function(){
    return (
      <form onSubmit={this.handleSearch}>
        <input type="text" placeholder='Search...' className="search" onChange={this.handleSearchWord} ref="search_input" />
        <button type="submit" className="btn btn-sm btn-search"><i className={this.icon()}></i></button>
      </form>
    )
  },
  icon: function(){
    if (this.props.gs.searching){
      return 'fa fa-refresh fa-spin'
    }else{
      return 'fa fa-search'
    }
  }
});
