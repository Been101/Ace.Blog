var Queue = require('./Queue')

function fibonacci(n) {
  // console.log(n)
  // if(n <= 1) {return n}
  if(n == 0) {return 0}
  if(n == 1) {return 1}
  return (fibonacci(n - 1) + fibonacci(n - 2))
}

var a = fibonacci(5)
console.log(a);


function fib( N){    
  if(N==0||N==1) return N;
   a=0,b=1;
  for( i=2;i<=N;i++){
      // b=a+b;
      // a=b-a;        
      [a, b] = [b -a, a + b]
  }
  return b;
}

console.log(fib(5))


function fib(n) {
  var queue = new Queue()
  queue.enqueue(1)
  queue.enqueue(1)
  var index = 0;

  while(index < n - 2) {
    var del_item = queue.dequeue()
    var head_item = queue.head()
    var next_item = del_item + head_item
    queue.enqueue(next_item)
    index += 1
  }

  queue.dequeue()
  return queue.head()
}

console.log(fib(5))
