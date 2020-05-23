function Queue() {
  var queue = []

  this.enqueue = function (item) {
    queue.push(item)
  }

  this.dequeue = function (item) {
    return queue.shift()
  }

  this.head = function () {
    return queue[0]
  }

  this.size = function () {
    return queue.length
  }

  this.clear = function () {
    queue = []
  }

  this.isEmpty = function () {
    return !queue.length
  }
}

module.exports = Queue