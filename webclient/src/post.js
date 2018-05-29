import React from "react"
import ReactDOM from "react-dom"

export default class Post extends React.Component {
  async newComment() {
    const comment = prompt("What is the comment ?")
    if (comment && comment.length > 0) {
      this.props.sendComment(this.props.value.postId, comment)
    }
  }

  render() {
    return (
      <div>
        <pre>{this.props.value.text}</pre>
        <small>id: {this.props.value.postId}</small> -
        <small> user: {this.props.value.owner}</small>
        <div>
          <button type="button" onClick={() => this.newComment()} >New Comment</button>
        </div>
        <hr />
      </div>
    )
  }
}
