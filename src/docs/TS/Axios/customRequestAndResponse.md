## 请求和响应配置话

### 需求分析

官方的默认库给 `axios` 添加了 `transformRequest` 和 `transformResponse` 两个字段，他们的值是一个数组或一个函数。

其中 `transformRequest` 允许你在将请求数据发送到服务器之前对其进行修改，这只适用于请求方法 `get` `post` `patch`, 如果值是数组，则数组中的最后一个函数必须返回一个字符串或 `formData` `URLSearchParams` `Blob` 等类型作为 `xhr.send` 方法的参数，而且在 `transform` 过程中可以修改 `header` 对象。

而 `transfromResponse` 允许你在把响应数据传递给 `then` 或者 `catch` 之前对他们进行修改。

当值为数组的时候， 数组的每一个函数都是一个转换函数，数组中的函数就像管道一样依次执行，前者的输出作为后者的输入。

举个例子:

`types/index.ts`
```ts
  axios({
    transformRequest: [(function(data) {
      return qs.stringify(data)
    }), ...axios.defaults.transformRequest],
    transfromResponse: [axios.defaults.transfrmResponse, function(data) {
      if(typeof data === 'object') {
        data.b = 2
      }
      return data
    }],
    url: '/config/post',
    method: 'post',
    data: {
      a: 1
    }
  })
```

### 修改默认配置
先修改 `AxiosRequestConfig` 的类型定义，添加 `transformRequest` 和 `transformResponse` 两个可选属性。

`defaults.ts`
```ts
  export interface AxiosRequestConfig {
    // ...
    transformRequest?: AxiosTransformer | AxiosTransformer []
    transformResponse?: AxiosTransformer | AxiosTransformer[]
  }

  export interface AxiosTransformer {
    (data: any, headers?: any): any
  }
```

### transform 逻辑重构

接下来，我们就要重构之前写的对请求数据和响应数据的处理逻辑了。由于我们可能会编写多个转换函数，我们先定义一个 `transfrom` 函数来处理这些转换函数的调用逻辑。

`core/transform.ts`

```ts
  import { AxiosTransformer } from '../types'

  export default function transform(data: any, headers: any, fns?: AxiosTransformer | AxiosTransformer[]): any {
    if(!fns) {
      return data
    }
    if(!Array.isArray(fns)) {
      fns = [fns]
    }
    fns.forEach(fn => {
      data = fn(data, headers)
    })

    return data
  }
```

`transfrom` 函数中接收 `data` `headers` `fns` 3个参数，其中 `fns` 代表一个或多个转换函数，内部逻辑很简单，遍历 `fns`，执行这些转换函数，并且把 `data` 和 `headers` 作为参数传入，每个转换函数返回的 `data` 会作为下一个转换函数的参数 `data` 传入。

接下啦修改对请求数据和响应数据的处理逻辑。

`dispatchRequest.ts`