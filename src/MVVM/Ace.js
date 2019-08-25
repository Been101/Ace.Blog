class Ace{
    constructor(options) {
        this.$options = options

        // 数据响应化
        this.$data = options.data
        this.observe(this.$data)
        // 测试代码 start
        // new Watcher() //
        // console.log(Dep.target)
        // this.$data.name; // 读一下属性,  执行get, 加入subs
        // new Watcher() //
        // console.log(Dep.target)
        // this.$data.age; // 读一下属性,  执行get, 加入subs
        // 测试代码 end

        // 使用compiler
        new Compiler(options.el, this)

        // created执行
        if(options.created){
            options.created.call(this)
        }
        
    }

    observe(data) {
        if(!data || typeof data !== 'object'){
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])

            // 代理data中的属性到vue 实例上
            this.proxyData(key)
        });
    }

    defineReactive(data, key, value) {
        this.observe(value) // 递归解决数据嵌套
        const dep = new Dep()
        Object.defineProperty(data, key, {
            get() {
                Dep.target && dep.addDep(Dep.target)
                return value
            },
            set(newVal) {
                if(newVal === value){
                    return
                }
                value =  newVal
                console.log(`${key} 属性更新了， 值为${newVal}`)
                dep.notify()
            }
        })
    }

    proxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key]
            },
            set(val) {
                this.$data[key] = val
            }
        })
    }
}

class Dep{
    constructor() {
        // 这里存放若干 依赖(watcher) 一个属性生成一个dep
        this.deps = []
    }
    addDep(dep){
        this.deps.push(dep)
    }

    notify() {
        this.deps.forEach(dep => dep.update())
    }
}

class Watcher{
    constructor(vm, key, cb) {
        console.log(vm, '<---')
        this.vm = vm
        this.key = key
        this.cb = cb
        Dep.target = this // hack 操作，把watcher  实例赋给Dep.target 以方便后面加入subs
        this.vm[this.key]
        Dep.target = null
    }
    update() {
        console.log('属性更新了')
        console.log(this.vm)
        console.log(this.key)
        this.cb.call(this.vm, this.vm[this.key])
    }
}