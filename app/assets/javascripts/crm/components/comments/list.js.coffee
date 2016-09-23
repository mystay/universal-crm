@Comments = React.createClass
  getInitialState: ->
    subjectId: null
    comments: []
    content: ''
    focused: false
    
  componentDidMount: ->
    @loadComments()
  componentDidUpdate: ->
    if (@state.subjectId==null || @props.subject_id!=@state.subjectId)
      @loadComments()
    
  valid: ->
    @state.content != ''
  handleSubmit: (e) ->
    e.preventDefault()
    $.post '/universal/comments', { subject_type: @props.subject_type, subject_id: @props.subject_id, content: @state.content}, (data) =>
      @replaceState comments: data, content: '', focused: false
      @props.countComments(data.length)
    , 'JSON'
    
  handleChange: (e) ->
    @setState content: e.target.value
    
  render: ->
    R = React.DOM
    R.div null,
      if @props.newCommentPosition == 'bottom'
        R.div null,
          @renderCommentList()
          if @openComments()
            @renderCommentForm()
      else
        R.div null,
          if @openComments()
            @renderCommentForm()
          @renderCommentList()
              
      
  renderCommentForm: ->
    R = React.DOM
    R.div null,
      R.form className: '', onSubmit: @handleSubmit,
        R.div className: 'form-group',
          R.textarea className: 'form-control', value: @state.content, placeholder: 'Leave a comment...', onChange: @handleChange, style: {minHeight: '80px'}

        if @valid()
          R.div className: 'form-group',
            R.button className: 'btn btn-primary btn-sm', disabled: !@valid(),
              R.i className: 'fa fa-check'
              ' Save this comment'
              
  renderCommentList: ->
    R = React.DOM
    R.div className: 'chat-widget',
      if @state.comments
        R.div null,
          for comment in @state.comments
            React.createElement Comment, key: comment.id, comment: comment
    
  loadComments: (e) ->
    $.ajax
      method: 'GET'
      url: "/universal/comments?subject_type=#{@props.subject_type}&subject_id=#{@props.subject_id}"
      success: (data) =>
        @setState comments: data, subjectId: @props.subject_id
        @props.countComments(data.length)
        
  openComments: ->
    @props.status == 'active'