var TicketShowContainer = React.createClass({
  getInitialState: function(){
    return ({
      commentCount: 0,
      ticketId: null,
      ticket: null,
      loading: null
    })
  },
  componentDidMount: function(){
    this.loadTicket(this.props.ticketId);
  },
  componentDidUpdate: function(){
    if (this.props.ticketId != null && this.props.ticketId != this.state.ticketId && !this.state.loading){
      this.loadTicket(this.props.ticketId);
    }else if (this.props.ticketId==null && this.state.ticketId!=null){
      this.setState({ticket: null, ticketId: null})
    }
  },
  loadTicket: function(id){
    var _this=this;
    if (id!=undefined&& id != ''&&!this.state.loading){
      this.setState({loading: true});
      $.ajax({
        method: 'GET',
        url: `/crm/tickets/${id}.json`,
        success: function(data){
          if (data.ticket){
            _this.setState({ticketId: data.ticket.id, ticket: data.ticket, loading: false});
            _this.props.handlePageHistory(`${data.ticket.number}: ${data.ticket.title}`, `/crm/ticket/${id}`);
          }
        }
      });
    }
  },
  countComments: function(e){
    this.setState({commentCount: e});
  },
  changeTicketFlag: function(f, add){
    $.ajax({
      method: 'PATCH',
      url: `/crm/tickets/${this.state.ticket.id}/flag?flag=${f}&add=${add}`,
      success: (function(_this){
        return function(data){
          _this.setState({ticket: data.ticket});
        }
      })(this)
    });
  },
  changeTicketStatusActive: function(){
    this.changeTicketStatus('active');
  },    
  changeTicketStatusClosed: function(){
    this.changeTicketStatus('closed')
  },  
  changeTicketStatusActioned: function(){
    this.changeTicketStatus('actioned')
  },
  changeTicketStatus: function(s, add){
    $.ajax({
      method: 'PATCH',
      url: `/crm/tickets/${this.state.ticket.id}/update_status?status=${s}`,
      success: (function(_this){
        return function(data){
          _this.setState({ticket: data.ticket});
        }
      })(this)
    });
  },
  setCustomerId: function(){
    if (this.props._goCustomer){
      this.props._goCustomer(this.state.ticket.subject_id);
    }
  },
  fromTo: function(){
    if (this.state.ticket.incoming){
      return 'From:'
    }else{
      return 'To:'
    }
  },
  render: function(){
    if (this.state.ticket){
      return (
        <div className="panel panel-info">
          <div className="panel-heading">
            <h3 className="panel-title">
              <div className="pull-right text-muted">{this.state.ticket.from_email}</div>
              {this.fromTo()} <TicketCustomerName 
                name={this.state.ticket.subject_name}
                id={this.state.ticket.subject_id}
                _goCustomer={this.props._goCustomer}
                      /> 
            </h3>
          </div>
          <div className="panel-body">
            <ExpandedTicket
              ticketId={this.state.ticket.id}
              ticket={this.state.ticket}
              status={this.state.ticket.status}
              changeTicketFlag={this.changeTicketFlag}
              changeTicketStatusActive={this.changeTicketStatusActive}
              changeTicketStatusClosed={this.changeTicketStatusClosed}
              changeTicketStatusActioned={this.changeTicketStatusActioned}
              countComments={this.countComments}
              ticketFlags={this.props.gs.config.ticket_flags}
              />
          </div>
        </div>
      )
    }else{
      return(null);
    }
  }
});