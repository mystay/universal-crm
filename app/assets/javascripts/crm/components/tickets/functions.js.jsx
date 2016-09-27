var TicketFunctions = React.createClass({
  render: function(){
    return(
      <div>
        <div className="pull-right">
          {this.closeButton()}
        </div>
        {this.ticketFlags()}
      </div>
    )
  },
  ticketFlags: function(){
    var btns = [];
    for (var i=0;i<this.props.ticketFlags.length;i++){
      var flag = this.props.ticketFlags[i];
      flagStyle = this.flagButtonStyle(flag.label, `#${flag.color}`);
      var btn = []
      btn.push(<button key={`add_${flag.label}`} className="btn btn-xs" style={flagStyle} onClick={this.addFlag} name={`add_${flag.label}`}>{flag.label}</button>)
      if (this.flagged(flag.label)){
        btn.push(<button key={`remove_${flag.label}`} className="btn btn-xs btn-default" style={flagStyle} onClick={this.removeFlag} name={`remove_${flag.label}`}>x</button>)
      }
      btns.push(<div key={`btn_group_${flag.label}`} className="btn-group" style={{marginRight: '5px'}}>{btn}</div>)
    }
    return (<span>{btns}</span>);
  },
  removeFlag: function(e){
    flag = e.target.name.replace('remove_','');
    if (this.flagged(flag)){
      this.props.changeTicketFlag(flag, false);
    }
  },
  addFlag: function(e){
    flag = e.target.name.replace('add_','');
    if (!this.flagged(flag)){
      this.props.changeTicketFlag(flag, true);
    }
  },
  flagButtonStyle: function(flag_label, color){
    if (this.flagged(flag_label)){
      return {background: color, color: '#FFF'}
    }else{
      return null
    }
  },
  flagged: function(flag_label){
    return this.props.flags.indexOf(flag_label.toString())>-1;
  },
  closeButton: function(){
    if (this.props.status == 'closed'){
      return (
          <button className="btn btn-info btn-xs" onClick={this.props.changeTicketStatusActive}>
            <i className="fa fa-check" /> Reopen
          </button>
      )
    }else{
      return (
          <button className="btn btn-success btn-xs" onClick={this.props.changeTicketStatusClosed}>
            <i className="fa fa-check" /> Close Ticket
          </button>
      )
    }
  }
});