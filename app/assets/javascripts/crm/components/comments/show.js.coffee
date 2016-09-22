@Comment = React.createClass
  render: ->
    timeago = jQuery.timeago(@props.comment.when)
    R = React.DOM
    R.li key: @props.comment.id, className: 'list-group-item',
      R.h5 className: 'list-group-item-heading',
        nl2br(@props.comment.content)
      R.p className: 'list-group-item-text text-muted small',
        if @props.comment.author
          "#{@props.comment.author}, "
        timeago