// 先进后出

function Stack() {
  let items = []

  // 从栈顶添加元素 压栈
  this.push = function(item) {
    items.push(item)
  }

  this.pop = function() {
    return items.pop()
  }

  this.top = function() {
    return items[items.length - 1]
  }

  this.isEmpty = function() {
    return !items.length
  }

  this.size = function() {
    return items.length
  }

  this.clear = function() {
    items = []
  }
}

var str = '(()()(amff)())'

function is_leagl_brackets(str) {
  var stack = new Stack()
  for(var i = 0; i < str.length; i++) {
    var item = str[i]
    if(item === '(') {
      stack.push(item)
    }
    if(item === ')') {
      if(stack.isEmpty()) {
        return false
      }else {
        stack.pop()
      }
    }
  }

  return stack.isEmpty()
}

// var str2 = ')(asfl))'
// console.log(is_leagl_brackets(str))
// console.log(is_leagl_brackets(str2))

module.exports = Stack


