const Queue = require('./Queue')
function del_ring(arr) {
  var index = 0;
  while(arr.length !== 1) {
    var item = arr.shift()
    index += 1
    if(index % 3 !== 0) {
      arr.push(item)
    }
  }
  console.log(arr)
  return arr[0]
}
var arr = []
for(var i = 1; i <= 10; i++) {
  arr.push(i)
}
// console.log(del_ring(arr))


function del_ring2(arr){
  var queue = new Queue()
  for (let index = 0; index < arr.length; index++) {
    const item = arr[index];
    queue.enqueue(item)
  }
  var i = 0;
  while(queue.size() !== 1) {
    i++
    var del_item = queue.dequeue()
    if(i % 3 !== 0) {
      queue.enqueue(del_item)
    }
  }
  return queue.head()
}

console.log(del_ring2(arr))
