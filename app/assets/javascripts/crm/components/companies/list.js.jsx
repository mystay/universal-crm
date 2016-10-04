var CompanyList = React.createClass({
  companies: function(){
    var companies=[]
    for (var i=0;i<this.props.companies.length;i++){
      company = this.props.companies[i];
      companies.push(<li key={company.id}><a onClick={this.linkCompany} data-id={company.id} style={{cursor: 'pointer'}}>{company.name}</a></li>);
    }
    return companies;
  },
  render: function(){
    return(
      <ul className="small">
        {this.companies()}
      </ul>
    );
  },
  linkCompany: function(e){
    this.props._goCompany($(e.target).attr('data-id'));
  }
});