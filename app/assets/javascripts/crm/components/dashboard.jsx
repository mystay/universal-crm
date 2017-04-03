/*
  global React
  global $
*/
var Dashboard = React.createClass({
  getInitialState: function(){
    return({
      ticketCounts: null,
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
          _this.setState({ticketCounts: data.ticket_counts, flagCounts: data.flags, totalFlags: data.totalFlags, loading: false});
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
        </div>
      </div>
    );
  },
  ticketCountTiles: function(){
    if (this.state.ticketCounts){
      return(
        <div className="row">
          <div className="col-sm-6">{this.dashboardTile('envelope', this.state.ticketCounts.inbox, 'Inbox', 'success', 'email')}</div>
          <div className="col-sm-6">{this.dashboardTile('folder-open', this.state.ticketCounts.open, 'Open Tickets', 'primary', 'active')}</div>
          <div className="col-sm-6">{this.dashboardTile('exclamation-triangle', this.state.ticketCounts.actioned, 'Follow up', 'warning', 'actioned')}</div>
          <div className="col-sm-6">{this.dashboardTile('ban', this.state.ticketCounts.closed, 'Closed Tickets', 'default', 'closed')}</div>
        </div>
      );
    }
  },
  dashboardTile: function(icon, count, label, css, link){
    return(
      <div className={`panel panel-solid-${css} widget-mini`}>
        <div className="panel-body" onClick={this.goTicketList} data-link={link} style={{cursor: 'pointer'}}>
         <i className={`fa fa-${icon}`} data-link={link} />
         <span className="total text-center" data-link={link}>{count}</span>
         <span className="title text-center" data-link={link}>{label}</span>
        </div>
      </div>
    );
  },
  goTicketList: function(e){
    this.props._goTicketList($(e.target).attr('data-link'));
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
  }
});