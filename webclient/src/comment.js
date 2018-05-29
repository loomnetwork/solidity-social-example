import React from "react"
import ReactDOM from "react-dom"

export default class Comment extends React.Component {
  render() {
    return (
      <div>
        <pre>{this.props.value.text}</pre>
        <small>{this.props.value.owner}</small>
        <hr />
      </div>
    )
  }
}
