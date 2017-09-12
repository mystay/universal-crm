/*
  global React
  global $
  global ReactDOM
*/

var Newsfeed = React.createClass({
  getInitialState: function(){
    return({
      results: [],
      employees: null,
      loading: false,
      pagination: null,
      pageNum: null,
      userId: null,
      ticketKind: null, 
      companyId: null,
      employeeId: null, 
      showFilters: false
    });
  },
  companyAutocomplete: function() {
    var _this = this;
    var CompanySearch = ReactDOM.findDOMNode(_this.refs.company);
    $(CompanySearch).autocomplete({
      source: `/crm/companies/autocomplete`,
      monLength: 3,
      autoFocus: false,
      delay: 400,
      select: function(e, ui){
        e.preventDefault();
        CompanySearch.value = ui.item.label;
        _this.setState({companyId: ui.item.value});
        _this.loadFeed(1, _this.state.userId, _this.state.ticketKind, ui.item.value, _this.state.employeeId);
      },
      focus: function(e,ui){
        e.preventDefault();
        _this.setState({companyId: null});
      }
    });
  },
  optionalFilters: function(){
    var divStyle = {
      display: ((this.state.showFilters == false) ? 'none' : 'inline')
    }
    return(
      <div className="form-group" style={divStyle}>
        <div className="col-sm-12"><h3>Optional filters</h3></div>
        <div className="col-sm-6">
          <input type="text" className="form-control" placeholder="Company..." id="companySearch" ref="company" onChange={this.handleCompanySearch} />
        </div>
        <div className="col-sm-6">
          {this.employeeSelect()}
        </div>
      </div>
    )
  },
  employeeSelect: function(){
    var employees = this.state.employees;
    if (employees){
      var u = [];
      for (var i=0;i<employees.length;i++){
        var employee = employees[i];
        u.push(<option key={employee[0]} value={employee[0]}>{employee[1]}</option>);
      }
      return(
        <select className="form-control" onChange={this.handleEmployeeSelect}><option value=''>Select Employee...</option>{u}</select>
      );
    }
  },
  handleEmployeeSelect: function(e){
    var employeeId = $(e.target).val();
    this.loadFeed(1, this.state.userId, this.state.ticketKind, this.state.companyId, employeeId);
    this.setState({employeeId: employeeId});
  },
  filtersButton: function(e){
    if (this.state.userId){
      var icon = ((this.state.showFilters) ? 'fa fa-minus' : 'fa fa-plus');
      return(
        <button type="button" className="btn show-filters" onClick={() => this.showFilters(!this.state.showFilters)}>
          <i className={icon}></i>
        </button>
      );
    }
  },
  showFilters: function(show){
    if (show){
      this.setState({showFilters: true})
    } else {
      this.clearOptionalFilters();
      this.setState({showFilters: false});
      this.loadFeed(1, this.state.userId, this.state.ticketKind, null, null);
    }
  },
  clearOptionalFilters: function(){
    $('#companySearch').val("");
    this.setState({companyId: null, employees: null, employeeId: null, });
  },
  handleCompanySearch: function(e){
    this.setState({companyId: null, employees: null, employeeId: null});
  },
  componentDidMount: function(){
    this.init();
  },
  init: function(){
    this.loadFeed();
    this.companyAutocomplete();
  },
  loadFeed: function(page, userId, ticketKind, companyId, employeeId){
    if (!this.state.loading){
      var _this=this;
      this.setState({loading: true, userId: userId, ticketKind: ticketKind, companyId: companyId, employeeId: employeeId});
      page = (page==undefined ? 1 : page);
      $.ajax({
        type: 'GET',
        url: `/crm/newsfeed.json`,
        data: {
          page: page,
          user_id: userId,
          subject_kind: ticketKind,
          company_id: companyId,
          employee_id: employeeId
        },
        success: function(data){
          _this.setState({
            results: data.results,
            loading: false,
            pagination: data.pagination,
            pageNum: page, 
            employees: ((data.employees[0]) ? data.employees : null)
          });
        }
      });
    }
  },
  render: function(){
    return(
      <div className="panel">
        <div className="panel-body">
          <div className="row">
            <div className="col-sm-3">
              <div className="form-group">
                {this.ticketKindList()}
              </div>
            </div>
            <div className="col-xs-3">
              <div className="form-group">
                {this.userList()}
              </div>
            </div>
            <div className="col-xs-3" style={{paddingLeft: '0px'}}>
              {this.filtersButton()}
            </div>
          </div>
          <div className="row">
            {this.optionalFilters()}
          </div>
          <hr />
          {this.resultList()}
          <Pagination
            pagination={this.state.pagination}
            currentPage={this.state.pageNum}
            pageResults={this.pageResults}
            displayDescription={true}
            />
        </div>
      </div>
    );
  },
  ticketKindList: function(){
    var u = [];
    u.push(<button key='email' className={`btn btn-sm btn-${this.state.ticketKind=='email' ? 'primary' : 'default'}`} data-kind="email" onClick={this.selectTicketKind} >Emails</button>);
    u.push(<button key='task' className={`btn btn-sm btn-${this.state.ticketKind=='task' ? 'primary' : 'default'}`} data-kind="task" onClick={this.selectTicketKind} >Tasks</button>);
    u.push(<button key='note' className={`btn btn-sm btn-${this.state.ticketKind=='note' ? 'primary' : 'default'}`} data-kind="note" onClick={this.selectTicketKind} >Notes</button>);
    return(<div className="btn-group">{u}</div>);
  },
  userList: function(){
    if (this.props.gs && this.props.gs.users){
      var u = [];
      for (var i=0;i<this.props.gs.users.length;i++){
        var user = this.props.gs.users[i];
        u.push(<option key={user.id} value={user.id}>{user.name}</option>);
      }
      return(<select className="form-control" onChange={this.selectUser}><option value=''>Select...</option>{u}</select>);
    }
  },
  selectUser: function(e){
    var userId = $(e.target).val();
    if (userId == ''){
      this.clearOptionalFilters();
      this.setState({showFilters: false});
      this.loadFeed(1, userId, this.state.ticketKind, null, null);
    } else {
      this.loadFeed(1, userId, this.state.ticketKind, this.state.companyId, this.state.employeeId);
    }
  },
  selectTicketKind: function(e){
    var ticketKind = $(e.target).attr('data-kind');
    this.loadFeed(1, this.state.userId, ticketKind, this.state.companyId, this.state.employeeId);
  },
  resultList: function(){
    var c = [];
    var pastSubjectId=null;
    var subjectTitle='';
    var commentTitle = this.commentTitle;
    var gs=this.props.gs;
    var sgs=this.props.sgs;
    var selectTicketId=this.selectTicketId;
    this.state.results.forEach(function(result){
      if (result.type=='ticket'){
        c.push(
          <li className="list-group-item" key={result.result.id}>
            <h4>Ticket created by {result.result.creator_name}:</h4>
            <h5 className="list-group-item-heading">
              <TicketTitleButton 
                ticket={result.result}
                selectTicketId={selectTicketId}
                gs={gs}
                sgs={sgs}
              />
            </h5>
          </li>
        );
      }else if (result.type=='comment'){
        c.push(
          <li className="list-group-item" key={result.result.id}>
            <h4>{result.result.author} commented on:</h4>
            <h5>
              <TicketTitleButton 
                ticket={result.subject}
                selectTicketId={selectTicketId}
                gs={gs}
                sgs={sgs}
              />
            </h5>
            <div className="chat-widget">
              <Comment key={result.result.id} comment={result.result} />
            </div>
          </li>
        );
      }
    });
    return(<ul className="list-group">{c}</ul>);
  },
  commentTitle: function(comment){
    if (comment.subject_type=='UniversalCrm::Ticket'){
      return(
        <h4 onClick={this.goTicket} data-subjectId={comment.subject_id} style={{cursor: 'pointer', fontWeight: 'bold'}} >{comment.subject_name}</h4>
      );
    }
  },
  selectTicketId: function(ticketId){
    this.props._goTicket(ticketId);
  },
  pageResults: function(page){
    this.loadFeed(page, this.state.userId, this.state.ticketKind, this.state.companyId, this.state.employeeId);
    this.setState({currentPage: page});
  }
});
