/*
  global React
  global ReactDOM
  global $
*/
var RelatedTask = React.createClass({
  render: function(){
    if (this.props.gs && this.props.gs.config && this.props.gs.config.functions.indexOf('tasks')>-1 && this.props.ticket.kind=='email'){
      return(
        <div className="well well-sm">
          {this.childTickets()}
          <button onClick={this.displayModal} className="btn btn-sm btn-warning">
            <i className="fa fa-plus-circle" /> New related task
          </button>
          <Modal ref='related_task_modal' modalTitle="Add a task" modalContent={this.form()} />
        </div>
      );
    }else{
      return(null);
    }
  },
  displayModal: function(){
    var modal = ReactDOM.findDOMNode(this.refs.related_task_modal);
    if (modal){
      $(modal).modal('show', {backdrop: 'static'});
    }
  },
  form: function(){
    return(
      <NewTicket key="new_task"
          subjectId={this.props.ticket.subject_id}
          subjectType={this.props.ticket.subject_type}
          parentTicketId={this.props.ticket.id}
          gs={this.props.gs}
          sgs={this.props.sgs}
          _goTicket={this.props._goTicket}
          kind='task'
          hideButtonList={true}
          hideModalId='related_task_modal'
          />
    );
  },
  childTickets: function(){
    var goTicket=this.goTicket;
    if (this.props.ticket.child_tickets && this.props.ticket.child_tickets.length>0){
      var h=[];
      for (var i=0;i<this.props.ticket.child_tickets.length;i++){
        var ticket = this.props.ticket.child_tickets[i];
        h.push(<li key={`related_${ticket.id}`}><a onClick={goTicket} data-id={ticket.id} style={{cursor: 'pointer'}}>{ticket.name}</a></li>);
      }
      return(
        <div>
          <h3>Related tasks:</h3>
          <ol>
            {h}
          </ol>
        </div>
      );
    }
  },
  goTicket: function(e){
    var ticketId = $(e.target).attr('data-id');
    this.props._goTicket(ticketId);
  }
});