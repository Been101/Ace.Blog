function Node(data) {
  this.data = data
  this.next = null
}

var node1 = new Node(1)
var node2 = new Node(2)

var node4 = new Node(4)
var node5 = new Node(5)


function LinkList() {
  let head = null
  let tail = null
  let length = 0

  this.append = function (data) {
    let new_node = new Node(data)
    if (!head) {
      head = new_node
      tail = new_node
    } else {
      tail.next = new_node
      tail = new_node     
    }
    length++
  }

  this.print = function () {
    let curr_node = head
    let link_str = ''
    while (curr_node) {
      link_str += curr_node.data + ' --> '
      curr_node = curr_node.next
    }
    console.log(link_str)
    console.log('length:', length)
  }

  function get_node(index) {
    if(index < 0 || index > length - 1) {
      return null
    }
    let curr_node = head
    let node_index = index
    while (node_index-- > 0) {
      curr_node = curr_node.next
    }
    return curr_node
  }

  this.insert = function (index, data) {
    if(index < 0 || index > length) {
      return false
    }
    if(index === 0) {
      let new_node = new Node(data)
      new_node.next = head
    }
    if(index === length){
      let new_node = new Node(data)
      tail.next = new_node
      tail = new_node
    }else {
      let pre_node = get_node(index -1)
      let new_node = new Node(data)
      new_node.next = pre_node.next
      pre_node.next = new_node
    }

    length++
    return true
  }

  this.remove = function (index) {
    let del_node = null
    if(index < 0 || index > length - 1) {
      return false
    }
    if(index === 0) {
      head = head.next
      if(!head) {
        tail = null
      }
    }else {
      let pre_node = get_node(index - 1)
      del_node = pre_node.next
      let next_node = pre_node.next.next
      pre_node.next = next_node
      if(!del_node.next) { // 如果删除的是尾节点
        tail = pre_node
      }
    }
    del_node.next = null
    length--
    return del_node.data
  }

  this.indexOf = function (data) {
    let index = 0
    let curr_node = head
    while (curr_node) {
      if(curr_node.data === data) {
        return index
      }else {
        curr_node = curr_node.next
      }
      index++
    }
    return -1
  }

  this.get = function (index) {
    const curr_node =  get_node(index)
    return curr_node ? curr_node.data : null
  }

  this.clear = function () {
    head = null
    tail = null
    length = 0
  }

  // 返回链表大小
  this.length = function(){
    return length;
  };

  // 删除头节点
  this.remove_head = function(){
    return this.remove(0);
  };

  // 返回指定位置节点的值
  this.get = function(index){
      var node = get_node(index);
      if(node){
          return node.data;
      }
      return null;
  };



  // 返回链表头节点的值
  this.head = function(){
      return this.get(0);
  }

  // 返回链表尾节点的值
  this.tail = function(){
      return this.get(length-1);
  }
  // isEmpty
  this.isEmpty = function(){
    return length == 0;
  };
}

const link = new LinkList()

link.append(1)
link.append(2)
link.append(3)
link.append(4)
link.insert(2, 3)
console.log(link.indexOf(3));
 
link.print()
// exports.link = link
module.exports = LinkList