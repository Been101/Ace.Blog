const LinkList = require('./LinkList')

function linkToQueue() {
  let link = new LinkList()
  this.enqueue = function (data) {
    link.append(data)
  }

  this.dequeue = function () {
    return link.remove_head()
  }

  // 其他的方法也是对链表方法的一种封装
}