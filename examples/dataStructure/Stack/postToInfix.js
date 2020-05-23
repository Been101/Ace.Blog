const Stack = require('./Stack')

var priority_map = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2
}

function postToinfix(exp) {
  var stack = new Stack()
  var postfix_list = []
  for(var i = 0; i < exp.length; i++) {
    var item = exp[i]
    if(isNaN(item)) {
      if(item === '(') {
        stack.push(item)
      }else if(item === ')'){
        while (stack.top() !== '('){
          postfix_list.push(stack.pop())
        }
        stack.pop() // 弹出左括号
      }else {
        if(stack.isEmpty()) {
          stack.push(item)
        }else {
          while(priority_map[stack.top()] > priority_map[item]) {
            postfix_list.push(stack.pop())
          }
          stack.push(item)
        }
        
      }
    }else {
      postfix_list.push(item) 
    }
  }
  while(!stack.isEmpty()) {
    postfix_list.push(stack.pop())
  }

  return postfix_list
}
// var exp = ['2', '*', '4', '*', '3', '+', '6', '/', '2']
var exp = ["12","+", "3","*", "5"]
console.log(postToinfix(exp))