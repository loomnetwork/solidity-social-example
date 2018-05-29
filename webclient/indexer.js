const {
  Client,
  CryptoUtils,
  LoomProvider
} = require('loom-js')

const Web3 = require('web3')

var http = require('http');

let posts = []

;(async function () {
  const client = new Client(
    'default',
    'ws://127.0.0.1:46657/websocket',
    'ws://127.0.0.1:9999/queryws',
  )

  const web3 = new Web3(new LoomProvider(client))
  const ABI = [{
    "constant": false,
    "inputs": [{
      "name": "_postId",
      "type": "uint256"
    }, {
      "name": "_text",
      "type": "string"
    }],
    "name": "newComment",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }, {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "uint256"
    }],
    "name": "posts",
    "outputs": [{
      "name": "text",
      "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }, {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "uint256"
    }],
    "name": "commentFromAccount",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }, {
    "constant": false,
    "inputs": [{
      "name": "_text",
      "type": "string"
    }],
    "name": "newPost",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }, {
    "constant": true,
    "inputs": [],
    "name": "hasPosts",
    "outputs": [{
      "name": "_hasPosts",
      "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }, {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "uint256"
    }],
    "name": "comments",
    "outputs": [{
      "name": "text",
      "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }, {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "address"
    }, {
      "name": "",
      "type": "uint256"
    }],
    "name": "postsFromAccount",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }, {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "uint256"
    }, {
      "name": "",
      "type": "uint256"
    }],
    "name": "commentsFromPost",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }, {
    "anonymous": false,
    "inputs": [{
      "indexed": false,
      "name": "postId",
      "type": "uint256"
    }, {
      "indexed": false,
      "name": "owner",
      "type": "address"
    }, {
      "indexed": false,
      "name": "text",
      "type": "string"
    }],
    "name": "NewPostAdded",
    "type": "event"
  }, {
    "anonymous": false,
    "inputs": [{
      "indexed": false,
      "name": "postId",
      "type": "uint256"
    }, {
      "indexed": false,
      "name": "commentId",
      "type": "uint256"
    }, {
      "indexed": false,
      "name": "owner",
      "type": "address"
    }, {
      "indexed": false,
      "name": "text",
      "type": "string"
    }],
    "name": "NewCommentAdded",
    "type": "event"
  }]

  const loomContractAddress = await client.getContractAddressAsync('SimpleSocialNetwork')
  const contractAddress = CryptoUtils.bytesToHexAddr(loomContractAddress.local.bytes)

  this._contract = new web3.eth.Contract(ABI, contractAddress)
  this.ready = true

  this._contract.events.NewPostAdded({}, (err, event) => {
    posts.push(event.returnValues)
  })

  this._contract.events.NewCommentAdded({}, (err, event) => {
    posts = posts.map(post => {
      if (post.postId == event.returnValues.postId) {
        console.log('sddd')
        post.comments = post.comments || []
        post.comments.push(event.returnValues)
      }

      return post
    })
  })

  //create a server object:
  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
    res.write(JSON.stringify(posts)); //write a response to the client
    res.end(); //end the response
  }).listen(8081);
})()
