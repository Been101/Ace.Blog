// Dep 用来管理Watcher

export default class Dep{
    constructor() {
        // 这里存放若干 依赖(watcher) 一个属性生成一个watcher
        this.subs = []
    }
    addDep(dep){
        this.subs.push(dep)
    }

    notify() {
        this.deps.forEach(dep => dep.update())
    }
}