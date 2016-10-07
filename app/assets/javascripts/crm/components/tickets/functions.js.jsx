var TicketFunctions = React.createClass({
  render: function(){
    return(
      <div>
        <div className="pull-right">
          {this.buttons()}
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
      btn.push(<button key={`add_${flag.label}`} className="btn no-margin btn-xs" style={flagStyle} onClick={this.addFlag} name={`add_${flag.label}`}>{flag.label}</button>)
      if (this.flagged(flag.label)){
        btn.push(<button key={`remove_${flag.label}`} className="btn no-margin btn-xs btn-default" style={flagStyle} onClick={this.removeFlag} name={`remove_${flag.label}`}>x</button>)
      }
      btns.push(<div key={`btn_group_${flag.label}`} className="btn-group" style={{marginRight: '5px'}}>{btn}</div>)
    }
    if (this.props.status != 'closed'){
      return (<span>{btns}</span>);
    }else{
      return(<span>&nbsp;</span>);
    }
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
  buttons: function(){
    if (this.props.status == 'closed'){
      return (
          <button className="btn no-margin btn-info btn-xs" onClick={this.props.changeTicketStatusActive}>
            <i className="fa fa-folder-open" /> Reopen
          </button>
      )
    }else if (this.props.status == 'active'){
      return (
        <ul className="list-inline">
          <li><ChangeCustomerButton ticket={this.props.ticket} /></li>
          <li>
            <button className="btn no-margin btn-success btn-xs" onClick={this.props.changeTicketStatusActioned}>
              <i className="fa fa-check" /> Actioned
            </button>
          </li>
          <li>
            <button className="btn no-margin btn-danger btn-xs" onClick={this.props.changeTicketStatusClosed}>
              <i className="fa fa-ban" /> Close Ticket
            </button>
          </li>
        </ul>
      )
    }else if (this.props.status == 'actioned'){
      return (
        <ul className="list-inline">
          <li><ChangeCustomerButton ticket={this.props.ticket} /></li>
          <button className="btn no-margin btn-danger btn-xs" onClick={this.props.changeTicketStatusClosed}>
            <i className="fa fa-ban" /> Close Ticket
          </button>
        </ul>
      )
    }
  }
});