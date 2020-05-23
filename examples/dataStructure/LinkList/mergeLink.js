var Node = function(data){
  this.data = data;
  this.next = null;
}

var node1 = new Node(3);
var node2 = new Node(4);
var node3 = new Node(9);

var node4 = new Node(2);
var node5 = new Node(5);
var node6 = new Node(6);
var node7 = new Node(10);
var node8 = new Node(12);


node1.next = node2;
node2.next = node3;

node4.next = node5;
node5.next = node6;
node6.next = node7;
node7.next = node8;

function merge_link1(head1, head2) {
  if(!head1) return head2
  if(!head2) return head1

  let merge_head = null
  let merge_tail = null
  let min_data = null

  let curr1 = head1
  let curr2 = head2

  while(curr1 && curr2) {
    if(curr1.data < curr2.data) {
      min_data = curr1.data
      curr1 = curr1.next
    }else {
      min_data = curr2.data
      curr2 = curr2.next
    }

    if(!merge_head) {
      merge_head = new Node(min_data)
      merge_tail = merge_head
    }else {
      const new_node = new Node(min_data)
      merge_tail.next = new_node
      merge_tail = new_node
    }
  }

  // 循环结束后，还有某个链表还有值
  let rest_link = null
  if(curr1) {
    rest_link = curr1
  }
  if(curr2) {
    rest_link = curr2
  }

  while(rest_link){
    merge_tail.next = rest_link;
    merge_tail = rest_link;
    rest_link = rest_link.next;
  }
  return merge_head
}

console.log(merge_link1(node1, node4));
