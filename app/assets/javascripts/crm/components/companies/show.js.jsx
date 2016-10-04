var CompanyShowContainer = React.createClass({
  getInitialState: function(){
    return({
      companyId: null,
      company: null,
      loading: false
    });
  },
  componentDidMount: function(){
    this.loadCompany(this.props.companyId);
  },
  componentDidUpdate: function(){
    if (this.props.companyId != null && this.props.companyId != this.state.companyId && !this.state.loading){
      this.loadCompany(this.props.companyId);
    }else if (this.props.companyId==null && this.state.companyId!=null){
      this.setState({company: null})
    }
  },
  loadCompany: function(id){
    var _this=this;
    if (id!=undefined&& id != ''&&!this.state.loading){
      this.setState({loading: true});
      $.ajax({
        method: 'GET',
        url: `/crm/companies/${id}.json`,
        success: function(data){
          if (data.company){
            _this.setState({companyId: data.company.id, company: data.company, loading: false});
            _this.props.handlePageHistory(`${data.company.name}`, `/crm/company/${id}`);
          }
        }
      });
    }
  },
  render: function(){
    if (this.state.company){
      return(<CompanyShow company={this.state.company} _goTicket={this.props._goTicket} config={this.props.config} loadTickets={this.props.loadTickets} />);
    }else{
      return(null);
    }
  }
});
  
var CompanyShow = React.createClass({
  
  render: function(){
    return(
      <div>
        <div className="row">
          <div className="col-sm-6">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h3 className="panel-title">{this.props.company.name}</h3>
              </div>
              <div className="panel-body">
                Email: {this.props.company.email}
              </div>
            </div>
            <NewTicket key="new_ticket"
              subjectId={this.props.company.id}
              subjectType='UniversalCrm::Company'
              subject={this.props.company}
              loadTickets={this.props.loadTickets}
              config={this.props.config}
              _goTicket={this.props._goTicket}
              />
          </div>
          <div className="col-sm-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Company data</h3>
              </div>
              <div className="panel-body">
                <div className="tab-wrapper tab-primary">
                  <ul className="nav nav-tabs">
                    <li className="active"><a data-toggle="tab" href="#tab-notes">Notes</a></li>
                    <li><a data-toggle="tab" href="#tab-attachments">Attachments</a></li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane active" id="tab-notes">
                      <Comments 
                        subject_type='UniversalCrm::Company'
                        subject_id={this.props.company.id}
                        newCommentPosition='bottom'
                        status='active'
                        newCommentPlaceholder='New note...'
                        fullWidth={true}
                        />
                    </div>
                    <div className="tab-pane" id="tab-attachments">
                      <Attachments subjectId={this.props.company.id} subjectType='UniversalCrm::Company' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <TicketList _goTicket={this.props._goTicket} config={this.props.config} subjectId={this.props.company.id} subjectType='UniversalCrm::Company' />
          </div>
        </div>
      </div>
    );
  }
});
