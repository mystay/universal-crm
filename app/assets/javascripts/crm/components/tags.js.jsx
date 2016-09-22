var Tags = React.createClass({
  getInitialState: function(){
    return {
      tags: [],
      editedTags: [],
      edit: false,
      subjectId: null
    }
  },
  handleToggle: function(e){
    e.preventDefault();
    this.setState({edit: !this.state.edit});
  },
  componentDidUpdate: function(){
    field = ReactDOM.findDOMNode(this.refs.edit_field);
    if (this.state.edit && field){
      field.focus();
    }
    if (this.state.tags!=this.props.tags){
      this.setState({tags: this.props.tags});
    }
  },    
  handleEdit: function(e){
    this.setState({editedTags: e.target.value.replace(', ',',').split(',')});
  },
  handleSubmit: function(e){
    e.preventDefault();
    this.setState({edit: false, tags: this.state.editedTags});
    $.ajax({
      method: 'POST',
      url: `/universal/tags?model_class=${this.props.subject_type}&model_id=${this.props.subject_id}`,
      dataType: 'JSON',
      data: {tags: this.state.editedTags.join(',')}
    });
  },
  onIcon: function(e){
    e.target.className = 'fa fa-fw fa-pencil';
  },
  offIcon: function(e){
    e.target.className = 'fa fa-fw fa-tags';
  },
  listTags: function(){
    var tags = []
    for (var i=0;i<this.state.tags.length;i++){
      var tag = this.state.tags[i];
      tags.push(<span key={i} className="label label-info" style={{display: 'inline-block', marginRight: '5px'}}>{tag}</span>)
    }
    return(
      <div>
        <a onClick={this.handleToggle} style={{cursor: 'pointer', marginRight: '5px'}}>
          <i className='fa fa-fw fa-tags' onMouseOver={this.onIcon} onMouseOut={this.offIcon} />
        </a>
        {tags}
      </div>
    )
  },
  editForm: function(){
    return (
      <div>
        <form className='form' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <input
              className='form-control'
              defaultValue={this.props.tags.join(', ')}
              onChange={this.handleEdit}
              id="tag_edit_field_{this.props.subject_id}"
              ref='edit_field' />
          </div>
        </form>
        <div className='form-group'>
          <button className='btn btn-xs btn-warning white-text' onClick={this.handleToggle}>Cancel</button>
        </div>
      </div>
    )
  },        
  render: function(){
    var html;
    if (this.state.edit){
      html = this.editForm();
    }else{
      html = this.listTags();
    }
    return(
      <div>{html}</div>
    )
  }
});