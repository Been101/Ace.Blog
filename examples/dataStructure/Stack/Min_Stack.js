const Stack = require('./Stack')

function Min_Stack() {
  var data_stack = new Stack()
  var min_stack = new Stack()
  this.push = function(item) {
    data_stack.push(item)
    if(min_stack.isEmpty() || item < min_stack.top()) {
      min_stack.push(item)
    }else {
      min_stack.push(min_stack.top())
    }
  }

  this.pop = function() {
    data_stack.pop(item)
    min_stack.pop(item)
  }

  this.min = function() {
    console.log(min_stack.size(), '<----size')
    return min_stack.top()
  }

  this.top = function() {
    return data_stack.top()
  }
}

var minstack	= new Min_Stack();
minstack.push(3);
minstack.push(6);
minstack.push(8);
console.log(minstack.min());
minstack.push(2);
console.log(minstack.min());
console.log(minstack.top());