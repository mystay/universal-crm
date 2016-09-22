var CustomerSearch = React.createClass({
  render: function(){
    return (
      <div className="input-group" style={{marginBottom: '10px'}}>
        <input type="text" placeholder='Search...' onChange={this.props.handleSearch} className='form-control' />
        <span className="input-group-addon"><i className="fa fa-search" /></span>
      </div>
    )
  }
});