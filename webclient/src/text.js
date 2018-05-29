import React from "react"
import ReactDOM from "react-dom"

export default class Text extends React.Component {
  constructor() {
    super()
    this.textEntry = React.createRef()
  }

  render() {
    return (
      <div>
        <textarea cols="80" rows="5" ref={this.textEntry}></textarea>
        <button type="button" onClick={() => this.props.onTextEntry(this.textEntry.current.value)}>New Post</button>
      </div>
    )
  }
}
