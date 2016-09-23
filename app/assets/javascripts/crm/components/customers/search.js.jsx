var CustomerSearch = React.createClass({
  render: function(){
    return (
      <div>
        <input type="text" placeholder='Search...' className="search" onChange={this.props.handleSearch} />
        <button type="submit" className="btn btn-sm btn-search"><i className="fa fa-search"></i></button>
      </div>
    )
  }
});
