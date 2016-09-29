var Header = React.createClass({
  
  render: function(){
    return(
      
      <header id="header">
        <BrandLogo crm_title={this.props.crm_title} />
        <ul className="nav navbar-nav navbar-left">
          <li className="toggle-navigation toggle-left">
            <button className="sidebar-toggle" id="toggle-left">
              <i className="fa fa-bars"></i>
            </button>
          </li>
          <li className="hidden-xs hidden-sm">
            <CustomerSearch
              key="customer_search"
              loadCustomers={this.props.loadCustomers}
              handleSearch={this.props.handleSearch}
              />
          </li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li className="dropdown profile hidden-xs">
            <a href="javascript:void(0);" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <span className="meta">
                <span className="text">{this.props.username}</span>
                <span className="caret"></span>
              </span>
            </a>
            <ul className="dropdown-menu animated bounceIn" role="menu">
              <li>
                <a href="/logout">
                  <span className="icon"><i className="fa fa-sign-out"></i></span>
                  Logout
                </a>
              </li>
            </ul>
          </li>
          <li className="toggle-fullscreen hidden-xs">
            <button type="button" className="btn btn-default expand" id="toggle-fullscreen">
                <i className="fa fa-expand"></i>
            </button>
          </li>
        </ul>
      </header>
    )    
  }
});