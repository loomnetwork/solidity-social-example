const http = require('http')

module.exports = {
  getIndexed
}

function getIndexed(callback) {
  function reqListener () {
    callback(JSON.parse(this.responseText))
  }

  let oReq = new XMLHttpRequest()
  oReq.addEventListener("load", reqListener)
  oReq.open("GET", "http://localhost:8081/")
  oReq.send()
}
