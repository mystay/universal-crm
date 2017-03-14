/*
  global React
  global $
*/
var Employees = React.createClass({
  getInitialState: function(){
    return({
      employees: [],
      loading: false,
      pastProps: null
    });
  },
  init: function(){
    this.setState({loading: true, pastProps: this.props, employees: this.props.employees});
  },
  componentDidMount: function(){
    this.init();
  },
  componentDidUpdate: function(){
    if (this.state.pastProps != this.props && !this.state.loading){
      this.init();
    }
  },
  render: function(){
    return(
      <div>
        <table className="table table-condensed">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Tickets</th>
            </tr>
          </thead>
          <tbody>
            {this.employeeList()}
          </tbody>
        </table>
      </div>
    );
  },
  employeeList: function(){
    var rows = [];
    var clickCustomer = this.clickCustomer;
    var ticketCount = this.ticketCount;
    this.state.employees.forEach(function(employee){
      rows.push(
        <tr key={employee.id}>
          <td><a id={employee.id} onClick={clickCustomer} style={{cursor: 'pointer'}}>{employee.name}</a></td>
          <td className="small">{employee.email}</td>
          <td className="text-center">{ticketCount(employee.open_ticket_count)}</td>
        </tr>
        );
    });
    return rows;
  },
  clickCustomer: function(e){
    this.props.sgs('searchWord', '');
    this.props._goCustomer(e.target.id);
  },
  ticketCount: function(c){
    if (c>0){
      return(<span className="badge badge-warning" style={{fontSize: '12px', backgroundColor: '#ffab40'}}>{c}</span>)
    }
  },
});