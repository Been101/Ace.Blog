## 栈
栈是一种特殊的线性表， 仅能够在栈顶进行操作， 有着先进后出的特性。

![](https://user-gold-cdn.xitu.io/2020/4/20/171981f64fc98912)

### 栈的简单实现

- 实现栈可以有两种方式，一种是以数组做基础；一种是以链表做基础。
- 栈的方法
    - push (添加一个元素到栈顶)
    - pop (弹出栈顶元素)
    - top (返回栈顶元素， 注意不是弹出)
    - isEmpty (判断栈是否为空)
    - size (返回栈里元素的个数)
    - clear (清空栈)

[以数组为基础的完整代码实现](https://github.com/Been101/data-structure/blob/master/Stack/Stack.js)
```
function Stack {
    var items = []
    this.push = function (item) {
        items.push(item)
    }
    this.pop = function() {
        return items.pop()
    }
    this.top = function() {
        return items[items.length - 1]
    }
    this.isEmpty = function() {
        return !items.length
    }
    this.size = function () {
        return items.length
    }
    this.clear = function() {
        items = []
    }
}
```

### 应用练习

1. 编写一个函数判断字符串中的括号是否合法, 所谓合法，就是括号成对出现。

```
sff()sf(sasfa)sfa(sdfsfd(sf))   合法
((asf)sf(af)fa)                 合法
)(sfa)f                         不合法
(saf))fafa(sss()                不合法
```

思路分析：
- for循环遍历字符串每一个字符
- 遇到左括号(, 就把左括号压入栈中
- 遇到右括号，判断栈是否为空， 为空说明没有左括号与之对应， 缺少左括号， 字符串括号不合法，如果栈不为空，则把栈顶元素弹出，这对括号抵消掉
- for 循环结束之后， 如果栈是空的， 说明左右括号抵消掉了，字符串合法。如果栈里还有元素，则说明缺少右括号，字符串不合法

`代码实现`

```
function is_leagl_brackets(str) {
    let stack = new Stack()
    for(let i = 0; i < str.length; i++) {
        const item = str[i]
        if(item === '(') {
            stack.push(item)
        }
        if(item === ')') {
            if(stack.isEmpty()) {
                return false
            }else {
                stack.pop()
            }
        }
    }
    
    return stack.isEmpty()
}
```
2. 逆波兰表达式

也叫后缀表达式，它将复杂表达式转换为可以依靠简单的操作得到计算结果的表达式， 例如 (a + b) * (c + d) 转换为a b + c d + *
```
["4", "13", "5", "/", "+"] 等价于(4 + (13 / 5)) = 6
["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"] 等价于((10 *	
(6/((9 + 3) * -11 ))) + 17) + 5
```

思路：

for 循环遍历数组，对每一个元素做如下操作
- 如果元素不是 + - * / 中某一个，直接压入栈。
- 如果是 + - / *中的一个，则连续弹出两个元素，并对这两个元素进行计算，且第一元素在运算符右侧， 第二个在运算符左侧，并把计算结果压入栈。

for 循环结束后， 栈里只有一个元素， 则这个元素就是整个表达式的计算结果。

`代码实现`
```
const operators = ['+', '-', '*', '/']
function calc_exp(exp_arr){
    const stack = new Stack()
    for(let i = 0; i < exp_arr.length; i++) {
        const item = exp_arr[i]
        if(operators.includes(item)) {
            // 从栈顶弹出连个元素
            const val1 = stack.pop()
            const val2 = stack.pop()
            // 拼成表达式
            const str = val2 + item + val1
            const result = parseInt(eval(str))
            // 将计算结果转成字符串并压入栈
            stack.push(result.toString())
        }else {
            stack.push(item)
        }
    }
    // for 循环结束， 栈里只有一个元素， 就是最终的结果。
    return stack.pop()
}

```
