/*
  global React
  global $
*/
var CompanyShow = React.createClass({
  render: function(){
    if (this.props.company.id && this.props.company){
      var newTicket = null;
      if (this.props.company.status=='active'){
        newTicket = <NewTicket key="new_ticket"
              subjectId={this.props.company.id}
              subjectType='UniversalCrm::Company'
              subject={this.props.company}
              loadTickets={this.props.loadTickets}
              gs={this.props.gs}
              sgs={this.props.sgs}
              _goTicket={this.props._goTicket}
              />;
      }
      return(
        <div className="row">
          <div className="col-sm-6">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h3 className="panel-title">{this.props.company.name}</h3>
              </div>
              <div className="panel-body">
                {this.renderViewEdit()}
              </div>
              <div className="panel-footer text-right">
                <button className="btn btn-warning btn-sm m-0" onClick={this.props.handleEdit}>
                  <i className="fa fa-pencil" />
                  {this.props.edit ? ' Cancel' : ' Edit'}
                </button>
              </div>
            </div>
            {newTicket}
          </div>
          <div className="col-sm-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">company data</h3>
              </div>
              <div className="panel-body">
                <div className="tab-wrapper tab-primary">
                  <ul className="nav nav-tabs">
                    <li className="active"><a data-toggle="tab" href="#tab-notes">Notes</a></li>
                    <li><a data-toggle="tab" href="#tab-attachments">Attachments</a></li>
                    <li><a data-toggle="tab" href="#tab-settings">Settings</a></li>
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
                        allowEmail={false}
                        />
                    </div>
                    <div className="tab-pane" id="tab-attachments">
                      <Attachments subjectId={this.props.company.id} subjectType='UniversalCrm::Company' />
                    </div>
                    <div className="tab-pane" id="tab-settings">
                      <CompanySettings company={this.props.company} gs={this.props.gs} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="tab-wrapper tab-primary">
              <ul className="nav nav-tabs">
                <li className="active"><a data-toggle="tab" href="#tab-tickets">Tickets</a></li>
                <li><a data-toggle="tab" href="#tab-ticket-attachments">Attachments</a></li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane active" id="tab-tickets">
                  <TicketList
                    _goTicket={this.props._goTicket}
                    _gocompany={this.props._gocompany}
                    subjectId={this.props.company.id}
                    subjectType='UniversalCrm::Company'
                    gs={this.props.gs}
                    sgs={this.props.sgs}
                    />
                </div>
                <div className="tab-pane" id="tab-ticket-attachments">
                  <Attachments parentId={this.props.company.id} parentType='UniversalCrm::Company' subjectType='UniversalCrm::Ticket'/>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }else{
      return(null);
    }
  },
  renderViewEdit: function(){
    if (this.props.edit){
      return(
        <CompanyEdit
          company={this.props.company}
          handleEdit={this.props.handleEdit}
          setcompanyId={this.props.setcompanyId}
          setcompany={this.props.setcompany}
          />
      );
    }else{
      return(
        <div className="row">
          <div className="col-sm-8">
            <dl className="dl-horizontal">
              <dt>Email:</dt>
              <dd className="small">{this.props.company.email}</dd>
              <dt>Address:</dt>
              <dd className="small">{this.props.company.address.formatted}</dd>
            </dl>
            <Tags subjectType="UniversalCrm::Company" subjectId={this.props.company.id} tags={this.props.company.tags} />
          </div>
        </div>
      );
    }
  }
});