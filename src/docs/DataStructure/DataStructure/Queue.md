## 队列

### 定义

队列是一种特殊的线性表，只能从头部删除元素，从尾部添加元素。

`入队示意图`
![](https://user-gold-cdn.xitu.io/2020/4/24/171ac933fea3b530?w=908&h=756&f=png&s=67268)

`出队示意图`
![](https://user-gold-cdn.xitu.io/2020/4/24/171ac9609ce45654?w=921&h=789&f=png&s=64469)

左侧是队首，右侧是队尾，元素只能从队尾入队，队首出队。

## 队列的实现

队列的基本方法

- enqueue  添加元素
- dequeue 删除元素
- head  查看头部元素
- tail 查看尾部元素
- size 返回队列大小
- clear 清空队列
- isEmpty 判断队列是否为空

```js
function Queue() {
    let items = []
    this.enqueue = function (item){
        items.push(item)
    }
    this.dequeue = function() {
        return items.shift()
    }
    this.head = function() {
        return items[0]
    }
    this.tail = function() {
        return items[items.length - 1]
    }
    this.size = function() {
        return items.length
    }
    this.clear = function() {
        items = []
    }
    this.isEmpty = function() {
        return !items.length
    }
}
```

## 队列应用

### 约瑟夫环

有一个数组， 存放0 - 99 这个100个数，要求每隔两个数删除一个数， 到末尾时循环到开头继续进行，求最后一个被删除的数。

思路：
- 准备一个队列， 把数据入队
- while 遍历队列中的每一个元素，看第 n 个元素是否是 3 的倍数， 是则删除， 不是则入队。
- 直到队列中还剩一个元素

```js
let arr = new Array(100).fill(1).map((_, j) => j) // 准备 100 个元素的数组

function de_ring(arr) {
    let queue = new Queue()
    for(let i = 0 ; i < arr.length; i++) {
        queue.enqueue(i)
    }
    let index = 0
    while(queue.size() > 1) {
        const item = queue.dequeue()
        i += 1
        if(i % 3 !== 0) {
            queue.enqueue(item)
        }
    }
    return queue.dequeue()
}

del_ring(arr)

```








