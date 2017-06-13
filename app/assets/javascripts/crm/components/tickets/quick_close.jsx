/*
  global React
  global $
*/
var QuickClose = React.createClass({
  getInitialState: function(){
    return({ticket: null});
  },
  componentDidMount: function(){
    this.setState({ticket: this.props.ticket});
  },
  render: function(){
    if (this.state.ticket && this.state.ticket.kind == 'task'){
      return(
        this.closeButton()
      );
    }else{
      return(null);
    }
  },
  closeButton: function(){
    if (this.state.ticket.status == 'active'){
      return(
        <span style={{marginRight: '10px', cursor: 'pointer'}}>
          <i className="fa fa-square-o text-success" onClick={this.closeTicket} title="Complete task" /> <span className="small">Complete</span>
        </span>
      );
    }else{
      return(
        <span style={{marginRight: '10px', cursor: 'pointer'}}>
          <i className="fa fa-check-square text-success" onClick={this.openTicket} title="Reopen task" /> <span className="small">Complete</span>
        </span>
      );
    }
  },
  closeTicket: function(){
    var _this=this;
    $.ajax({
      method: 'PATCH',
      url: `/crm/tickets/${this.state.ticket.id}/update_status?status=closed`,
      success: function(data){
        _this.setState({ticket: data.ticket});
      }
    });
  },
  openTicket: function(){
    var _this=this;
    $.ajax({
      method: 'PATCH',
      url: `/crm/tickets/${this.state.ticket.id}/update_status?status=active`,
      success: function(data){
        _this.setState({ticket: data.ticket});
      }
    });
  }
});