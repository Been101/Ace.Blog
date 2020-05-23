const LinkList = require('./LinkList')
function linkToStack() {
  // 栈， 先进后出
  let linkList = new LinkList()
  this.push = function (item) {
    linkList.append(item)
  }

  this.pop = function () {
    return linkList.removeTail()
  }

  // 其他的方法无非是对链表的方法进行一个封装
}