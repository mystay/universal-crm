/*
  global React
  global $
*/
var TicketDueOn = React.createClass({
  getInitialState: function(){
    return({
      editing: false,
      dueOn: null
    });
  },
  componentDidMount: function(){
    this.setState({dueOn: this.props.dueOn});
  },
  componentDidUpdate: function(){
    var _this=this;
    $('.datepicker').datepicker({dateFormat:'yy-mm-dd', 
      onSelect: function(date){
        _this.handleDueOnChange(date);
      }});
  },
  render: function(){
    if (this.props.dueOn){
      var labelClass = 'warning';
      if (new Date(this.props.dueOn) < new Date()){
        labelClass = 'danger';
      }
      return(
        <div>
          <span className={`label label-${labelClass}`} style={{marginLeft: (this.props.margin ? '10px' : null)}}>Due: {this.props.dueOn}{this.editButton()}</span>
          {this.editForm()}
        </div>
      );
    }else{
      return(null);
    }
  },
  handleDueOnChange: function(date){
    this.setState({dueOn: date});
  },
  editDate: function(){
    this.setState({editing: true});
  },
  editButton: function(){
    return(
      <i className="fa fa-pencil" onClick={this.editDate} style={{marginLeft: '10px'}} />
    );
  },
  editForm: function(){
    if (this.state.editing){
      return(
        <div className="row">
          <div className="col-sm-4">
            <div className="form-group">
              <input type="text" className="datepicker form-control" placeholder="DD-MM-YYYY" />
            </div>
          </div>
        </div>
      );
    }
  }
});