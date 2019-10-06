import Dep from './Dep'
export default class Watcher{
    constructor() {
        Dep.target = this // hack 操作，当Watcher 实例时把它加入subs
    }
    update() {
        console.log('属性更新了')
    }
}