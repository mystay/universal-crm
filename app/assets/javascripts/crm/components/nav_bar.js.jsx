var NavBar = React.createClass({
  home: function(){
    $("#customer_summary").hide();
    $("#customer_search").show();
    this.props.setCustomerId(null);
    this.props.setTicketId(null);
  },
  breadcrumb: function(){
    if (this.props.pageTitle==null){
      return (
        <ul className="breadcrumb">
          <li className="active">Home</li>
        </ul>
      )
    }else{
      return (
        <ul className="breadcrumb">
          <li><a href="javascript:void(0);" onClick={this.home}>Home</a></li>
          <li className="active">{this.props.pageTitle}</li>
        </ul>
      )
    }
  },
  render: function(){
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header pull-left">
            {this.breadcrumb()}
          </div>
        </div>
      </nav>
    )
  }
});