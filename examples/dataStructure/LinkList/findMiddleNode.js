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


function findMiddleNode(head) {
  let fast = head
  let slow = head
  while(fast && fast.next) { // 确保当前元素和下一个元素有值
    console.log(fast.next)
    fast = fast.next.next
    slow = slow.next
  }
  console.log(slow)
}

findMiddleNode(node1)