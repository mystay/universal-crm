/*
  global React
  global $
*/
var Dashboard = React.createClass({
  getInitialState: function(){
    return({
      ticketCounts: null,
      customerCounts: null,
      companyCounts: null,
      flagCounts: null,
      totalFlags: 0,
      timer: null,
      loading: false,
      pastProps: null
    });
  },
  componentDidMount: function(){
    this.init();
  },
  componentWillUnmount: function(){
    window.clearTimeout(this.state.timer);
  },
  init: function(){
    if (!this.state.loading){
      this.setState({loading: true, pastProps: this.props});
      var _this=this;
      $.ajax({
        type: 'GET',
        url: '/crm/dashboard',
        success: function(data){
          _this.setState({ticketCounts: data.ticket_counts, customerCounts: data.customer_counts, companyCounts: data.company_counts, flagCounts: data.flags, totalFlags: data.totalFlags, loading: false});
          _this.setState({timer: window.setTimeout(_this.init, 120000)});
        }
      });
    }
  },
  render: function(){
    return(
      <div className="row">
        <div className="col-sm-6">
          {this.ticketCountTiles()}
        </div>
        <div className="col-sm-6">
          {this.flagCounts()}
          {this.newTask()}
        </div>
      </div>
    );
  },
  newTask: function(){
    if (this.props.gs && this.props.gs.config && this.props.gs.config.functions.indexOf('tasks')>-1){
      return(
        <NewTicket key="new_task"
          subjectId={this.props.gs.user_customer.id}
          subjectType='UniversalCrm::Customer'
          subject={this.props.gs.user}
          loadTickets={this.props.loadTickets}
          gs={this.props.gs}
          sgs={this.props.sgs}
          _goTicket={this.props._goTicket}
          kind='task'
          hideButtonList={true}
          />
        );
    }
  },
  ticketCountTiles: function(){
    if (this.state.ticketCounts){
      return(
        <div>
          <div className="row">
            <div className="col-sm-4 col-xs-6">{this.ticketTile('envelope', this.state.ticketCounts.inbox, 'Emails', 'primary', 'email', 'active')}</div>
            {this.tasksTile()}
            <div className="col-sm-4 col-xs-6">{this.ticketTile('sticky-note', this.state.ticketCounts.notes, 'Notes', 'primary', 'normal', 'active')}</div>
            <div className="col-sm-4 col-xs-6">{this.ticketTile('folder-open', this.state.ticketCounts.open, 'Open Tickets', 'success', '', 'active')}</div>
            <div className="col-sm-4 col-xs-6">{this.ticketTile('exclamation-triangle', this.state.ticketCounts.actioned, 'Follow up', 'warning', '', 'actioned')}</div>
            <div className="col-sm-4 col-xs-6">{this.ticketTile('ban', this.state.ticketCounts.closed, 'Closed Tickets', 'default', '', 'closed')}</div>
          </div>
          <div className="row">
            {this.draftCustomers()}
            {this.draftCompanies()}
          </div>
        </div>
      );
    }
  },
  ticketTile: function(icon, count, label, css, kind, status){
    return(
      <div className={`panel panel-solid-${css} widget-mini`}>
        <div className="panel-body" onClick={this.goTicketList} data-kind={kind} data-status={status} style={{cursor: 'pointer'}}>
         <i className={`fa fa-${icon}`} data-kind={kind} data-status={status} />
         <span className="total text-center" data-kind={kind} data-status={status}>{count}</span>
         <span className="title text-center" data-kind={kind} data-status={status}>{label}</span>
        </div>
      </div>
    );
  },
  tasksTile: function(){
    if (this.props.gs && this.props.gs.config && this.props.gs.config.functions.indexOf('tasks')>-1){
      return(
        <div className="col-sm-4 col-xs-6">{this.ticketTile('check-circle', this.state.ticketCounts.tasks, 'Tasks', 'primary', 'task', 'active')}</div>
      );
    }
  },
  goTicketList: function(e){
    this.props._goTicketList($(e.target).attr('data-kind'), $(e.target).attr('data-status'));
  },
  goCustomerList: function(e){
    this.props._goCustomerList('', $(e.target).attr('data-link'));
  },
  goCompanyList: function(e){
    this.props._goCompanyList('', $(e.target).attr('data-link'));
  },
  flagCounts: function(){
    var f = [];
    var flagCounts = this.state.flagCounts;
    var totalFlags = this.state.totalFlags;
    if (this.props.gs.config.ticket_flags && flagCounts){
      this.props.gs.config.ticket_flags.forEach(function(flag){
        var flagCount = flagCounts[flag['label']];
        flagCount=((flagCount==undefined) ? 0 : flagCount.replace(',',''));
        f.push(
          <li key={flag['label']}>
            <span className="text-left">
              <i className="fa fa-fw fa-tag pull-right" style={{color: `#${flag['color']}`}}/> {flag['label']} <span className="text-info">({flagCount})</span>
            </span>
            <div className="progress progress-xs">
              <div className="progress-bar progress-bar-success" role="progressbar" style={{backgroundColor: `#${flag['color']}`, width: `${Math.round((flagCount/totalFlags)*100)}%`}}></div>
            </div>
          </li>
        );
      });
    }
    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Label counts</h3>
        </div>
        <div className="panel-body server-chart">
          <ul>{f}</ul>
        </div>
      </div>
    );
  },
  draftCustomers: function(){
    if (can(this.props.gs, 'approve_draft_customers') && this.state.customerCounts.draft>0){
      return(<div className="col-xs-6">{this.ticketTile('user', this.state.customerCounts.draft, 'Draft Customers', 'danger', 'draft', this.goCustomerList)}</div>);
    }
  },
  draftCompanies: function(){
    if (this.props.gs && this.props.gs.config && this.props.gs.config.functions.indexOf('companies')>-1 && can(this.props.gs, 'approve_draft_companies') && this.state.companyCounts.draft>0){
      return(<div className="col-xs-6">{this.ticketTile('building', this.state.companyCounts.draft, 'Draft Companies', 'danger', 'draft', this.goCompanyList)}</div>);
    }
  },
});