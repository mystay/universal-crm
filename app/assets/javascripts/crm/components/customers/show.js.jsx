var CustomerShow = React.createClass({
  render: function(){
    if (this.props.customer.id && this.props.customer){
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
            <NewTicket key="new_ticket"
              customerId={this.props.customer.id}
              customer={this.props.customer}
              loadTickets={this.props.loadTickets}
              config={this.props.config}
              />

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
                        />
                    </div>
                    <div className="tab-pane" id="tab-attachments">
                      <Attachments subjectId={this.props.customer.id} subjectType='UniversalCrm::Customer' />
                    </div>
                  </div>
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
        <CustomerEdit
          customer={this.props.customer}
          handleEdit={this.props.handleEdit}
          setCustomerId={this.props.setCustomerId}
          setCustomer={this.props.setCustomer}
          />
      )
    }else{
      return(
        <div className="row">
          <div className="col-sm-8">
            <dl className="dl-horizontal">
              <dt> Email:</dt>
              <dd>{this.props.customer.email}</dd>
              <dt>Phone (Home):</dt>
              <dd>{this.props.customer.phone_home}</dd>
              <dt>Phone (Work):</dt>
              <dd>{this.props.customer.phone_work}</dd>
              <dt>Phone (Mobile):</dt>
              <dd>{this.props.customer.phone_mobile}</dd>
            </dl>
            <Tags subjectType="UniversalCrm::Customer" subjectId={this.props.customer.id} tags={this.props.customer.tags} />
          </div>
        </div>
      )
    }
  }
});