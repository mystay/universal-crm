var CustomerSearch = React.createClass({
  getInitialState: function(){
    return({
      searchWord: null,
      searchTimer: null
    });
  },
  handleSearch: function(e){
    e.preventDefault();
    if (this.state.searchTimer == null){
      this.setState({searchTimer: setTimeout(this.loadSearch, 800)});
    }
  },
  handleSearchWord: function(e){
    this.setState({searchWord: e.target.value});    
  },
  loadSearch: function(){
    this.props._goCustomerList(this.state.searchWord);
    this.setState({searchTimer: null});
  },
  render: function(){
    return (
      <form onSubmit={this.handleSearch}>
        <input type="text" placeholder='Search...' className="search" onChange={this.handleSearchWord} />
        <button type="submit" className="btn btn-sm btn-search"><i className="fa fa-search"></i></button>
      </form>
    )
  }
});
