var RecentCompanies = React.createClass({
  getInitialState: function(){
    return({companies: null})
  },
  componentDidMount: function(){
    var _this=this;
    $.ajax({
      method: 'GET',
      url: `/crm/companies/recent.json`,
      success: function(data){
        if (data){
          _this.setState({companies: data.companies});
        }
      }
    });
  },
  render: function(){
    if (this.state.companies){
      return(
        <div>
          <h5 className="sidebar-header">Recent Companies</h5>
          <CompanyList companies={this.state.companies} _goCompany={this.props._goCompany} />
        </div>);
    }else{
      return(null);           
    }
  }
});