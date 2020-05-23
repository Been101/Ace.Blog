const Stack = require('../Stack/Stack')

function Stack2Queue() {
  let stack1 = new Stack()
  let stack2 = new Stack()

  this.enqueue = function (item) {
    stack1.push(item)
  }

  this.dequeue = function () {
    if(stack2.isEmpty() && stack1.isEmpty()){
      return null
    }else if(stack2.isEmpty()) {
      while(stack1.size() > 0) {
        stack2.push(stack1.pop())
      }
    }
    return stack2.pop()
  }
}

const queue = new Stack2Queue()

queue.enqueue('a')
queue.enqueue('b')
queue.enqueue('c')

console.log(queue.dequeue())

queue.enqueue('d')
queue.enqueue('e')

console.log(queue.dequeue())
console.log(queue.dequeue())