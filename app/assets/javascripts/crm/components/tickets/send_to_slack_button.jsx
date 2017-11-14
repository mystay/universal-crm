var SendToSlackButton = React.createClass({
  getInitialState: function(){
    return({
      ticket: this.props.ticket
    });
  },
  testButton: function(){
    console.log("Testing")
  },
  sendToSlack2: function(){
    $.ajax({
      method: 'PATCH',
      url: `/crm/tickets/${this.props.ticket.id}/send_to_slack?sender_id=${this.props.gs.user.id}`
    });
  },
  sendToSlack: function(){
    console.log("Sending ticket")
    var ticket = this.state.ticket
    var comments = ``
    ticket.comments.forEach(function(comment){
      if (comment.system_generated == false) {
        comments += `*${comment.author}*\n`
        comments += `${comment.content}`
        comments += `\n`
      }
    })
    var transcription = `*Ticket*\n`
    transcription += `URL: ${ticket.referring_url}\n`
    transcription += `*${ticket.title}*\n`
    transcription += `${ticket.content}\n`
    transcription += `${comments}\n`
    var ticket_info = `*Ticket Info*\n`
    ticket_info += `Created: ${ticket.created_at}\n`
    ticket_info += `Ticket ID: ${ticket.id}\n`
    ticket_info += `Sender Name: ${this.props.gs.user.name}\n`
    ticket_info += `Sender Email: ${this.props.gs.user.email}\n`
    var attachments = [
      {
        "text": transcription,
        "mrkdwn_in": ["text"],
        "callback_id": "helpdesk-text",
        "color": "#F03A47"
      },
      {
        "text": ticket_info,
        "mrkdwn_in": ["text"],
        "callback_id": "helpdesk-info",
        "color": "#065A82"
      },
      {
        "text": "Would you like to convert this to an issue in JIRA?",
        "mrkdwn_in": ["text"],
        "fallback": "You don't have pemission to do this",
        "callback_id": "helpdesk",
        "attachment_type": "default",
        "color": "#EB5E28",
        "actions": [
          {
            "name": "yes",
            "text": "Yes",
            "type": "button",
            "value": "yes"
          },
          {
            "name": "more-info",
            "text": "More info",
            "type": "button",
            "value": "more-info"
          },
          {
            "name": "no",
            "text": "No",
            "type": "button",
            "value": "no"
          }
        ]
      }
    ]
    if (ticket.attachments.length > 0) {
      ticket.attachments.forEach(function(attachment){
        var url = `http:${attachment.url}`
        attachments.splice(1, 0, {
          "text": `*${attachment.filename}*`,
          "mrkdwn_in": ["text"],
          "image_url": url,
          "color": "#065A82"
        })
      })
    }
    $.ajax({
      data: 'payload=' + JSON.stringify({
        "attachments": attachments
      }),
      dataType: 'json',
      processData: false,
      type: 'POST',
      url: 'https://hooks.slack.com/services/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'
      // ToDo: Get URL from app config
    });
  },
  render: function(){
    if (this.props.gs.users.length>0 && this.props.gs.user.functions.indexOf("send_to_slack") > -1){
      return(
        <div>
          <button className="btn btn-info btn-xs" onClick={this.sendToSlack2}>
            <i className="fa fa-send" /> Send to Development
          </button> 
        </div>
      );
    }else{
      return(null);
    }
  }
  // loadTicket: function(id){
  //   $.ajax({
  //     method: 'GET',
  //     url: `/crm/tickets/${id}.json`,
  //     success: (function(data){
  //       this.setState({ticket: data.ticket});
  //     }).bind(this)
  //   });
  // },
});