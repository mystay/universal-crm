/*
  global React
  global $
*/
var CustomerShow = React.createClass({
  render: function(){
    if (this.props.customer.id && this.props.customer){
      var newTicket = null;
      if (this.props.customer.status=='active'){
        newTicket = <NewTicket key="new_ticket"
              subjectId={this.props.customer.id}
              subjectType='UniversalCrm::Customer'
              subject={this.props.customer}
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
                <h3 className="panel-title">{this.props.customer.name}</h3>
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
                <h3 className="panel-title">Customer data</h3>
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
                        subject_type='UniversalCrm::Customer'
                        subject_id={this.props.customer.id}
                        newCommentPosition='bottom'
                        status='active'
                        newCommentPlaceholder='New note...'
                        fullWidth={true}
                        allowEmail={false}
                        />
                    </div>
                    <div className="tab-pane" id="tab-attachments">
                      <Attachments subjectId={this.props.customer.id} subjectType='UniversalCrm::Customer' />
                    </div>
                    <div className="tab-pane" id="tab-settings">
                      <CustomerSettings customer={this.props.customer} gs={this.props.gs} />
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
                    _goCustomer={this.props._goCustomer}
                    subjectId={this.props.customer.id}
                    subjectType='UniversalCrm::Customer'
                    gs={this.props.gs}
                    sgs={this.props.sgs}
                    />
                </div>
                <div className="tab-pane" id="tab-ticket-attachments">
                  <Attachments parentId={this.props.customer.id} parentType='UniversalCrm::Customer' subjectType='UniversalCrm::Ticket'/>
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
  mailto: function(){
    return `mailto:${this.props.customer.email}?bcc=${this.props.gs.config.inbound_email_addresses[0]}`
  },
  renderViewEdit: function(){
    if (this.props.edit){
      return(
        <CustomerEdit
          customer={this.props.customer}
          handleEdit={this.props.handleEdit}
          setCustomerId={this.props.setCustomerId}
          setCustomer={this.props.setCustomer}
          />
      );
    }else{
      return(
        <div className="row">
          <div className="col-sm-8">
            <dl className="dl-horizontal">
              <dt> Email:</dt>
              <dd className="small" style={{whiteSpace: 'nowrap'}}><a href={this.mailto()}>{this.props.customer.email} <i className="fa fa-external-link" /></a></dd>
              <dt>Phone (Home):</dt>
              <dd className="small">{this.props.customer.phone_home}</dd>
              <dt>Phone (Work):</dt>
              <dd className="small">{this.props.customer.phone_work}</dd>
              <dt>Phone (Mobile):</dt>
              <dd className="small">{this.props.customer.phone_mobile}</dd>
              {this.companies()}
            </dl>
            <Tags subjectType="UniversalCrm::Customer" subjectId={this.props.customer.id} tags={this.props.customer.tags} />
          </div>
        </div>
      );
    }
  },
  companies: function(){
    if (this.props.gs && this.props.gs.config && this.props.gs.config.companies){
      var rows = [];
      var goCompany = this.clickCompany
      this.props.customer.companies.forEach(function(company){
        rows.push(<div key={company.id}>
          <a id={company.id} onClick={goCompany} style={{cursor: 'pointer'}}>{company.name}</a>
        </div>);
      });
      return (<div>
        <dt>Companies:</dt>
        <dd>{rows}</dd>
      </div>);
    }
  },
  clickCompany: function(e){
    this.props._goCompany(e.target.id);
  }
});