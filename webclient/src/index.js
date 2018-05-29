import React from "react"
import ReactDOM from "react-dom"
import Contract from './contract'
import Text from './text'
import Post from './post'
import { getIndexed } from './indexer_client'

const Index = class Index extends React.Component {
  constructor() {
    super()
    this.contract = new Contract()
    this.state = {
      posts: [],
      user: null,
      ready: false
    }
  }

  async componentDidMount() {
    await this.contract.start()
    this.setState({user: this.contract.getUser()})
    getIndexed(posts => this.setState({posts}))
  }

  async newPost(text) {
    await this.contract.newPost(text)
    getIndexed(posts => this.setState({posts}))
  }

  async sendComment(postId, text) {
    await this.contract.newComment(postId, text)
  }

  render() {
    const posts = this.state.posts.map((post, index) => {
      return <Post value={post} key={index} sendComment={(postId, text) => this.sendComment(postId, text)} />
    })

    return (
      <div>
        <h1>Hello User: {this.state.user}</h1>
        <div>
          <Text onTextEntry={(text) => this.newPost(text)} ></Text>
        </div>
        <div>
          {posts}
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById("root"));
