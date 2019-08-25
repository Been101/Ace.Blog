// 用法 new Compile(el, vm)

class Compiler {
    constructor(el, vm) {
      this.$el = document.querySelector(el)
      this.$vm = vm
  
      if(this.$el){
        // 转换内部内容为片段Fragment
        this.$fragment = this.node2fragment(this.$el)
        // 执行编译
        this.compile(this.$fragment)
        // 将编译完的html结果追加至$el
        this.$el.appendChild(this.$fragment)
      }
    }
  
    node2fragment($el) {
      let frag = document.createDocumentFragment()
      let child
      while(child = $el.firstChild){
        frag.appendChild(child)
      }
      return frag
    }

    compile(el){
      const childNodes = el.childNodes
      Array.from(childNodes).forEach(node => {
        if(this.isElement(node)){
          // 元素
          // console.log('编译元素'+node.nodeName);
          // 查找k-，@，:
          const nodeAttrs = node.attributes
          Array.from(nodeAttrs).forEach(attr => {
            const name = attr.name
            const exp = attr.value
            console.log(name, exp)
            if(this.isDirective(name)){
              // k-text
              const dir = name.substring(2)
              // 执行指令
              this[dir] && this[dir](node, this.$vm, exp)
            }
            if(this.isEvent(name)){
              const dir = name.substring(1) // @click
              this.eventHandler(node, this.$vm, exp, dir)
            }
          })
        }
        if (this.isInterpolation(node)) {
          // 文本
          // console.log('编译文本'+node.textContent);
          this.compileText(node);
        }
  
        // 递归子节点
        if(node.childNodes && node.childNodes.length > 0){
          this.compile(node)
        }
      })
    }
  
    compileText(node) {
      // console.log(RegExp.$1);
      this.update(node, this.$vm, RegExp.$1, 'text')
    }
  
    // 更新函数
    update(node, vm, exp, dir){
      const updaterFn = this[dir + 'Updater']
      // 初始化
      updaterFn && updaterFn(node, vm[exp])
      // 依赖收集
      new Watcher(vm, exp, function(value){
        updaterFn && updaterFn(node, value)
      })
    }
  
    text(node, vm, exp){
      this.update(node, vm, exp, 'text')
    }
  
    //   双绑
    // model(node, vm, exp) {
    //   // 指定input的value属性
    //   this.update(node, vm, exp, "model");
  
    //   // 视图对模型响应
    //   node.addEventListener("input", e => {
    //     vm[exp] = e.target.value;
    //   });
    // }
  
    // modelUpdater(node, value) {
    //   node.value = value;
    // }
  
    // html(node, vm, exp) {
    //   this.update(node, vm, exp, "html");
    // }
  
    // htmlUpdater(node, value) {
    //   node.innerHTML = value;
    // }
  
    textUpdater(node, value) {
      node.textContent = value
    }
  
    //   事件处理器
    eventHandler(node, vm, exp, dir) {
      //   @click="onClick"
      let fn = vm.$options.methods && vm.$options.methods[exp]
      if(dir && fn){
        node.addEventListener(dir, fn.bind(vm))
      }
    }
  
    isDirective(attr) {
        return attr.startsWith('a-')
    }
    isEvent(attr) {
        return attr.startsWith('@')
    }
    isElement(node) {
      return node.nodeType === node.ELEMENT_NODE
    }
    // 插值文本
    isInterpolation(node) {
      return node.nodeType === node.TEXT_NODE && /\{\{(.*)\}\}/.test(node.textContent);
    }
  }
  