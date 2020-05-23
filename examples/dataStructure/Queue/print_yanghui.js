const Queue = require('./Queue')

function yanghui(n) {
  
  let queue = new Queue()
  queue.enqueue(1)
  for (let l = 1; l <= n; l++) {
    let line = ''
    let pre = 0
    for(let j = 0; j < l; j++) {
      const item = queue.dequeue()
      line += item + ' '
      let value = pre + item
      pre = item
      queue.enqueue(value)
    }
    console.log(line)
    queue.enqueue(1)
  }
}

yanghui(4)

function yanghui2(n) {
  let queue = new Queue()
  queue.enqueue(1)
  queue.enqueue(0)
  for(let l = 1; l <= n; l++) {
    let line = ''
    let pre = 0
    while(true) {
      const item = queue.dequeue()
      if(item === 0) {
        queue.enqueue(1) //下一行的最后一个元素
        queue.enqueue(0) // 下一行的最后 分隔元素 0
        break
      }else {
        line += item + ' '  // 当前行的 数据
        let value = pre + item  // 计算下行的数据
        pre = item
        queue.enqueue(value) // 下行的数据入队列
      }
    }

    console.log(line)
  }
}

yanghui2(4)