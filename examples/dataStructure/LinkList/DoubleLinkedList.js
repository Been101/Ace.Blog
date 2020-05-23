function Node(data) {
  this.data = data
  this.next = null
  this.pre = null
}


function DoubleLinkedList() {
  this.head = null
  this.tail = null
  
  this.append = function (data) {
    let new_node = new Node(data)

    if(!this.head) {
      this.head = this.tail = new_node
    }else {
      this.tail.next = new_node
      new_node.pre = this.tail
      this.tail = new_node
    }
  }
}