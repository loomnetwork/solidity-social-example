# Web3 + LoomProvider + React

Sample DAppChain showing the integration between LoomProvider and Web3 using React and [Loom.js](https://github.com/loomnetwork/loom-js).

![](https://dzwonsemrish7.cloudfront.net/items/3Q2n0D2B1B09381g053o/Screen%20Recording%202018-05-23%20at%2004.38%20PM.gif?v=e6c93cb3)

Development
----

### 1.) Run your own DappChain

Please consult the [Loom SDK docs](https://loomx.io/developers/docs/en/prereqs.html) for further instruction on running your own DappChain.

### 2.) Clone the example project

```bash
git clone https://github.com/loomnetwork/tiles-chain
```

### 3.) Start the DappChain

```bash
cd web3-loom-provider
mkdir tmpgopath
export GOPATH=`pwd`/tmpgopath

cd dappchain
wget https://storage.googleapis.com/private.delegatecall.com/loom/osx/build-132/loom
chmod +x loom

# Compile
export GOPATH=$GOPATH:`pwd`
make deps
make

# Configure
cd build
../loom init
cp ../genesis.example.json genesis.json

# Run
../loom run
```

### 4.) Start the web server

```bash
# On second terminal
cd web3-loom-provider/webclient

# Install
yarn

# Compile protobuf
yarn run proto

# Start the demo
yarn start

```

### 5.) Running

The Web3 Loom Provider web interface will be available on `http://localhost:8080`

Loom Network
----
[https://loomx.io](https://loomx.io)


License
----

MIT
