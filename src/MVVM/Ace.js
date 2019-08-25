class Ace{
    constructor(options) {
        this.$options = options

        // 数据响应化
        this.$data = options.data
        this.observe(this.$data)
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
        Object.defineProperty(data, key, {
            get() {
                return value
            },
            set(newVal) {
                if(newVal === value){
                    return
                }
                value =  newVal
                console.log(`${key} 属性更新了， 值为${newVal}`)
            }
        })
    }
}