const Stack = require('./Stack')

function postfix_expression(exp) {
  var stack = new Stack()
  var express = ['+', '-', '*', '/']
  for(var i = 0; i < exp.length; i++) {
    var item = exp[i]
    if(!express.includes(item)){
      stack.push(item)
    }else {
      var a = stack.pop()
      var b = stack.pop()
      // var str = b + item + a
      // var d = eval(str)
      // var e = parseInt(d)
      var c = parseInt(eval(b + item + a))
      stack.push(c + '')
    }
  }
  return stack.pop()
}

// const exp = ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]
// const exp = ['4', '13', '5', '/', '+']
// const exp = [ "6", "9", "3", "+", "-11", "*", "/"]
const exp = [ '2', '4', '3', '*', '*', '6', '2', '/', '+' ]
console.log(postfix_expression(exp))