// 用法 new Compile(el, vm) // el 要编译的元素模板， 和数据来源 vm
class Compiler {
    constructor(el, vm) {
        this.$el = document.querySelector(el)
        this.$vm = vm
        
        if(this.$el){
            // 转换内部内容为片段 fragment
            this.$fragment = this.node2fragment(this.$el)
            // 开始编译
            this.compile(this.$fragment)
            // 把编译完的 html 结果追加到$el
            this.$el.appendChild(this.$fragment)
        }
    }

    node2fragment($el) {
        let frag = document.createDocumentFragment()
        let child
        while((child = $el.firstChild)){
            frag.appendChild(child)
        }
        return frag
    }

    compile(el){
        const childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if(this.isElement(node)){
                // console.log(`${node.nodeType}---${node.nodeName}`)
                // 查找 v- @ :
                // 获得属性
                const nodeAttrs = node.attributes
                Array.from(nodeAttrs).forEach(attr => {
                    const name = attr.name
                    const exp = attr.value
                    // console.log(name, exp)
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
            }else if(this.isInterpolation(node)){
                this.compileText(node)
            }

            if(node.childNodes && node.childNodes.length > 0){
                this.compile(node)
            }
        })
    }

    compileText(node) {
        // console.dir(RegExp.$1)
        this.update(node, this.$vm, RegExp.$1, 'text')
    }

    // 更新函数 exp 属性  dir 什么指令  v-text v-html v-model
    update(node, vm, exp, dir){
        const updateFn = this[dir + 'Updater']
        // 初始化 更新函数
        updateFn && updateFn(node, vm[exp])
        // 收集依赖
        new Watcher(node, exp, function(value){
            updateFn && updateFn(node, value)
        })
    }

    text(node, vm, exp){
        this.update(node, vm, exp, 'text')
    }

    textUpdater(node, value) {
        node.textContent = value
    }

    eventHandler(node, vm, exp, dir) {
        // @click = 'onClick'
        const fn = vm.$options.methods && vm.$options.methods[exp]
        if(dir && fn){
            node.addEventListener(dir, fn.bind(vm))  // dir = 'click'     fn.bind(vm)  methods 中方法中的this 就能指向 vm 了
        }
    }
    isDirective(exp){
        return exp.startsWith('a-')
    }
    isEvent(exp) {
        return exp.startsWith('@')
    }
    isElement(node) {
        return node.nodeType === node.ELEMENT_NODE
    }
    isInterpolation(node) {
        return node.nodeType === node.TEXT_NODE && /\{\{(.*)\}\}/.test(node.textContent)
    }
    
}