var PageHeader = React.createClass({
  home: function(){
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
        <div className="pull-left hidden-xs">
          <ol className="breadcrumb">
            <li><a href="javascript:void(0);" onClick={this.home}>Home</a></li>
            <li>&nbsp;</li>
          </ol>
        </div>
      )
    }
  },
  render: function(){
    return (
      <nav className="pageheader">
        {this.breadcrumb()}
        {this.pageTitle()}
      </nav>
    )
  }
});