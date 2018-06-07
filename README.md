# Simple Social Network Example

Sample DAppChain showing the integration between LoomProvider, Web3 and [Loom.js](https://github.com/loomnetwork/loom-js) for a super simple social network interaction, where users can post and comment on posts

![](https://dzwonsemrish7.cloudfront.net/items/2W3c2O3G2A1q1l3f3D3d/Screen%20Recording%202018-05-29%20at%2003.35%20PM.gif)

> The smart contract compiled for this examples uses the Solidity version 0.4.24 (SimpleSocialNetwork.sol)

> This example also uses Redis and ElasticSearch to manages a cache layer

Development
----

### 1.) Run your own DappChain

Please consult the [Loom SDK docs](https://loomx.io/developers/docs/en/prereqs.html) for further instruction on running your own DappChain.

### 2.) Clone the example project

```bash
git clone https://github.com/loomnetwork/solidity-social-example
```

### 3.) Start the DappChain

```bash
cd solidity-social-example

cd dappchain
wget https://storage.googleapis.com/private.delegatecall.com/loom/osx/build-161/loom
chmod +x loom


# Configure
./loom init
cp genesis.example.json genesis.json

# Run
./loom run
```

### 4.) Start ElasticSearch and Redis

> Notice that both services are required in order to correct run and interact with the application

```bash
# macOS
brew tap homebrew/services
brew install elasticsearch
brew install redis

# Start services on macOS
brew services start elasticsearch
brew services start redis
```

### 5.) Start indexer

The `indexer.js` is a service which will receive all events from the smart contract and feeds a cache layer built on a message queue and a fast database (Redis + ElasticSearch), it also serves the app with a fresh data on the address `http://localhost:8081/posts` or `http://localhost:8081/comments`

Note this works best on Node8
```
brew install node@8
```

```bash
# On second terminal
cd web3-loom-provider/webclient
# install
yarn
node indexer.js
```

### 6.) Start the web server

Finally we're going to start the webserver which will supply the interface allowing users to interact to the smart contracts on the Loom DappChain

```bash
# On third terminal
cd web3-loom-provider/webclient

# Install
yarn

# Start the demo
yarn start

```

### 7.) Running

The Simple Social Network web interface will be available on `http://localhost:8080`


Loom Network
----
[https://loomx.io](https://loomx.io)


License
----

MIT
