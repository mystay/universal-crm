var PageHeader = React.createClass({
  home: function(){
    this.props._goHome();
  },
  pageTitle: function(){
    if (this.props.gs!=null){
      if (this.props.gs.pageTitle==null){
        return(<h1>Home</h1>);
      }else{
        return(<h1>{this.props.gs.pageTitle}</h1>);
      }
    }
  },
  breadcrumb: function(){
    if (this.props.gs!=null && this.props.gs.pageTitle!=null && this.props.gs.pageTitle!='Home'){
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