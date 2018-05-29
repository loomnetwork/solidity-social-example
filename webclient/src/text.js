import React from "react"
import ReactDOM from "react-dom"

export default class Text extends React.Component {
  constructor() {
    super()
    this.textEntry = React.createRef()
  }

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <form>
            <div className="form-group">
              <label >What's On Your Mind ? </label>
              <textarea className="form-control" rows="2" ref={this.textEntry}></textarea>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => this.props.onTextEntry(this.textEntry.current.value)}>New Post</button>
          </form>
        </div>
      </div>

    )
  }
}
