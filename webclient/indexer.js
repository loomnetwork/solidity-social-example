const Web3 = require('web3')
const Queue = require('bee-queue')
global.WebSocket = require('websocket').w3cwebsocket

const {
  Client,
  CryptoUtils,
  LoomProvider
} = require('loom-js')

const request = require('request-promise')
const http = require('http')
;(async function () {
  // Setting up Loom client
  const client = new Client(
    'default',
    'ws://127.0.0.1:46657/websocket',
    'ws://127.0.0.1:9999/queryws',
  )

  client.on('error', (message => {
    console.error('message', message)
  }))

  // Setting up Web3 with LoomProvider
  const web3 = new Web3(new LoomProvider(client))
  const ABI = [{"constant":false,"inputs":[{"name":"_postId","type":"uint256"},{"name":"_text","type":"string"}],"name":"newComment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"posts","outputs":[{"name":"text","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"commentFromAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_text","type":"string"}],"name":"newPost","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hasPosts","outputs":[{"name":"_hasPosts","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"comments","outputs":[{"name":"text","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"postsFromAccount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"commentsFromPost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"postId","type":"uint256"},{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"text","type":"string"}],"name":"NewPostAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"postId","type":"uint256"},{"indexed":false,"name":"commentId","type":"uint256"},{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"text","type":"string"}],"name":"NewCommentAdded","type":"event"}]

  const loomContractAddress = await client.getContractAddressAsync('SimpleSocialNetwork')
  const contractAddress = CryptoUtils.bytesToHexAddr(loomContractAddress.local.bytes)

  // Instantiate contract
  this._contract = new web3.eth.Contract(ABI, contractAddress)

  // Creating message queues
  const newPostQueue = new Queue('newPost')
  const newCommentQueue = new Queue('newComment')

  // Listen from post from smart contract
  this._contract.events.NewPostAdded({}, (err, event) => {
    // Push to message queue
    newPostQueue.createJob(event.returnValues).save()
  })

  // Listen from comments from smart contracts
  this._contract.events.NewCommentAdded({}, (err, event) => {
    // Push to message queue
    newCommentQueue.createJob(event.returnValues).save()
  })

  // Processing posts
  newPostQueue.process(async (job, done) => {
    // Push to ElasticSearch
    await request({
      method: 'POST',
      uri: 'http://localhost:9200/socialnetwork_posts/app',
      body: job.data,
      json: true
    })

    return done(null, true)
  })

  // Processing comments
  newCommentQueue.process(async (job, done) => {
    // Push to ElasticSearch
    await request({
      method: 'POST',
      uri: 'http://localhost:9200/socialnetwork_comments/app',
      body: job.data,
      json: true
    })

    return done(null, true)
  })

  // Create a basic read only API for expose posts and comments
  http.createServer(async (req, res) => {
    let url

    if (req.url === '/posts') {
      url = 'http://localhost:9200/socialnetwork_posts/_search'
    } else if (req.url == '/comments') {
      url = 'http://localhost:9200/socialnetwork_comments/_search'
    } else {
      // Type not indexed on ElasticSearch
      console.warn(`Request type ${req.url} not indexed`)
    }

    let ecResult
    try {
      res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
      ecResult = await request(url)
      res.write(ecResult)
    } catch (err) {
      res.writeHead(404, {'Access-Control-Allow-Origin': '*'})
    }

    res.end()
  }).listen(8081)

  console.log('Listen on 8081')
})()
