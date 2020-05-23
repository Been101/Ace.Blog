var Node = function(data){
  this.data = data;
  this.next = null;
};

var node1 = new Node(1);
var node2 = new Node(2);
var node3 = new Node(3);
var node4 = new Node(4);
var node5 = new Node(5);
var node6 = new Node(6);


node1.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = node5;
node5.next = node6;

// 倒数第k 个元素
function reverse_find(head, k) {
  let fast = head
  let slow = head
  let step = k 

  while(step > 0 && fast) {
    step--
    fast = fast.next
  }

  if(step !== 0) { // 链表不够长，  
    return null
  }else {
    while(fast) {
      fast = fast.next
      slow = slow.next
    }
  }
  console.log(slow)
  return slow
}

reverse_find(node1, 7)