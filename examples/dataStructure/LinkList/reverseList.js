function Node(data) {
  this.data = data
  this.next = null
}

var node1 = new Node(1)
var node2 = new Node(2)

var node4 = new Node(4)
var node5 = new Node(5)

node1.next = node2
node2.next = node4
node4.next = node5

function reverse_iter(head){
  if(!head){
      return null;
  }
  var pre_node = null;     // 前一个节点
  var curr_node = head;    // 当前要翻转的节点
  while(curr_node){
      var next_node = curr_node.next;    // 下一个节点
      curr_node.next = pre_node;         // 对当前节点进行翻转
      
      pre_node = curr_node;              // pre_node向后滑动
      curr_node = next_node;             // curr_node向后滑动
  }
  //最后要返回pre_node,当循环结束时,pre_node指向翻转前链表的最后一个节点
  return pre_node;
};
//  console.log(reverse_iter(node1));

function reverse_digui(head) {
  if(!head) {
    return null
  }

  if(!head.next) {
    return head
  }
  const new_head = reverse_digui(head.next) // 让下一个节点先反转， 反转后该节点是新链表的尾节点
  head.next.next = head
  head.next = null
  return new_head
}

console.log(reverse_digui(node1), '<-----');

