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
    console.log('component updated');
    if (this.state.pastProps != this.props && !this.state.loading){
      this.init();
    }
  },
  render: function(){
    return(
      <div>
        <table className="table table-bordered table-condensed">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
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
    this.state.employees.forEach(function(employee){
      rows.push(
        <tr key={employee.id}>
          <td><a id={employee.id} onClick={clickCustomer} style={{cursor: 'pointer'}}>{employee.name}</a></td>
          <td>{employee.email}</td>
        </tr>
        );
    });
    return rows;
  },
  clickCustomer: function(e){
    this.props.sgs('searchWord', '');
    this.props._goCustomer(e.target.id);
  },
  
});