/*
  global React
  global $
*/
var TicketDueOn = React.createClass({
  render: function(){
    if (this.props.dueOn){
      var labelClass = 'warning';
      if (new Date(this.props.dueOn) < new Date()){
        labelClass = 'danger';
      }
      return(
        <span className={`label label-${labelClass}`} style={{marginLeft: (this.props.margin ? '10px' : null)}}>Due: {this.props.dueOn}</span>
      );
    }else{
      return(null);
    }
  }
});