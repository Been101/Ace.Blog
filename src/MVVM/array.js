
const data = {
    name: 'ming',
    hobby: ['swimming', 'skating']
}

const originMethods = Object.create(Array.prototype)
const arrMethods = ['push', 'pop']

arrMethods.forEach(method => {
    const originMethod = Array.prototype[method]
    const newMethod = function(...args) {
        console.log('changed')
        return originMethod.apply(this, args)
    }
    originMethods[method] = newMethod
})

obseve(data)
function obseve(data) {
    if(!data || typeof data !== 'object'){
        return
    }
    if(Array.isArray(data)) {
        data.__proto__ = originMethods
    }

    Object.keys(data).forEach(key => {
        
        defineReactive(data, key, data[key])
    })
}

function defineReactive(obj, key, val) {
    obseve(val)
    Object.defineProperty(obj, key, {
        get() {
            console.log('get',val)
            return val
        },
        set(newVal) {
            if(newVal === val){
                return
            }
            console.log('set', newVal)
            val = newVal
        }
    })
}

data.hobby[0] = 'eating'
data.hobby.push('sleep')









