/*
  global React
  global $
*/
var CompanyShowContainer = React.createClass({
  getInitialState: function(){
    return {
      edit: false,
      company: null,
      companyId: null,
      loading: false,
      pastProps: null
    };
  },
  init: function(){
    this.loadcompany(this.props.companyId);
  },
  componentDidMount: function(){
    this.init();
  },
  componentDidUpdate: function(){
    if (this.state.pastProps != this.props && !this.state.loading){
      this.init();
    }
  },
  loadcompany: function(id){
    var _this=this;
    if (id!=undefined&& id != ''&&!this.state.loading){
      this.setState({loading: true, pastProps: this.props});
      $.ajax({
        method: 'GET',
        url: `/crm/companies/${id}.json`,
        success: function(data){
          if (data.company){
            _this.setcompany(data.company);
          }
        }
      });
    }
  },
  setcompany: function(company){
    this.setState({company: company, companyId: company.id, edit: false, loading: false});
    this.props.handlePageHistory(`${company.name}`, `/crm/company/${company.id}`);
  },
  handleEdit: function(){
    this.setState({edit: !this.state.edit});
  },
  render: function(){
    if (this.props.companyId && this.state.company){
      return(
        <CompanyShow 
          company={this.state.company}
          edit={this.state.edit}
          handleEdit={this.handleEdit}
          loadTickets={this.props.loadTickets}
          setcompany={this.setcompany}
          _goTicket={this.props._goTicket}
          _gocompany={this.props._gocompany}
          gs={this.props.gs} sgs={this.props.sgs}
        />
      );
    }else{
      return(null);
    }
  },
  setCompanyId: function(){
    if (this.props.setCompanyId){
      this.props.setCompanyId();
    }
  }
});