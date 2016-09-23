var PageHeader = React.createClass({
  home: function(){
    $("#customer_summary").hide();
    $("#customer_search").show();
    this.props.setCustomerId(null);
    this.props.setTicketId(null);
  },
  pageTitle: function(){
    if (this.props.pageTitle==null){
      return(<h1>Home</h1>);
    }else{
      return(<h1>{this.props.pageTitle}</h1>);
    }
  },
  breadcrumb: function(){
    if (this.props.pageTitle!=null){
      return (
        <div className="breadcrumb-wrapper hidden-xs">
          <span className="label">You are here:</span>
          <ol className="breadcrumb">
            <li><a href="javascript:void(0);" onClick={this.home}>Home</a></li>
            <li className="active">{this.props.pageTitle}</li>
          </ol>
        </div>
      )
    }
  },
  render: function(){
    return (
      <nav className="pageheader">
        {this.pageTitle()}
      </nav>
    )
  }
});