var BrandLogo = React.createClass({
  
  render: function(){
    return(
      <div className="brand">
        <a href="/crm" className="logo">
          <i className="fa fa-comments" style={{marginRight: '5px'}}/>
          <span>{this.props.crm_title == null ? 'CRM' : this.props.crm_title}</span>
        </a>
      </div>
    )
  }
});