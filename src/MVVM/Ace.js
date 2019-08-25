class Ace{
    constructor(options) {
        this.$options = options

        // 数据响应化
        this.$data = options.data
        this.observe(this.$data)
        // 测试代码 start
        new Watcher() //
        console.log(Dep.target)
        this.$data.name; // 读一下属性,  执行get, 加入subs
        new Watcher() //
        console.log(Dep.target)
        this.$data.age; // 读一下属性,  执行get, 加入subs
        // 测试代码 end
    }

    observe(data) {
        if(!data || typeof data !== 'object'){
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
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
}

class Dep{
    constructor() {
        // 这里存放若干 依赖(watcher) 一个属性生成一个dep
        this.subs = []
    }
    addDep(dep){
        this.subs.push(dep)
    }

    notify() {
        this.subs.forEach(dep => dep.update())
    }
}

class Watcher{
    constructor() {
        Dep.target = this // hack 操作，把watcher  实例赋给Dep.target 以方便后面加入subs
    }
    update() {
        console.log('属性更新了')
    }
}

class Compile {}