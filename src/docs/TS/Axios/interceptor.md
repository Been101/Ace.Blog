## 拦截器设计与实现

### 需求分析
我们希望能对请求的发送和响应做拦截， 也就是在发送请求之前和接收到响应之后做一些额外的逻辑。

我们希望设计的拦截器的使用方式如下:
```ts
  // 添加一个请求拦截器
  axios.interceptors.request.use(function(config) {
    // 在发送请求之前做一些事情
    return config
  }, function(error) {
    // 处理请求错误
    return Promise.reject(error)
  })

  // 添加一个响应拦截器
  axios.interceptors.response.use(function(response) {
    // 处理响应数据
    return response
  }, function(error) {
    // 处理请求错误
    return Promise.reject(error)
  })
```
在 `axios` 对象上有一个 `interceptors` 对象属性， 该属性又有`request` 和 `response` 2个属性，他们都有一个 `use` 方法， `use` 方法支持2个参数， 第一个参数类似Promise 的 `resolve` 函数， 第二个参数类似Promise 的 `reject` 函数。我们可以在 `resolve` 函数和 `reject` 函数中执行同步代码或者是异步代码逻辑。

并且我们是可以添加多个拦截器的， 拦截器的执行顺序是链式依次执行的方式。对于 `request` 拦截器，后添加的拦截器会在请求的过程中先执行; 对于 `response` 拦截器，先添加的拦截器会在响应后先执行。

```ts
  axios.interceptors.request.use(config => {
    config.headers.test += '1'
    return config
  })

  axios.interceptors.request.use(config => {
    config.headers.test += '2'
    return config
  })
```
此外, 我们也可以支持删除某个拦截器, 如下:

```ts
  const myInterceptor = axios.interceptors.request.use( function() {/****/})
  axios.interceptors.request.eject(myInterceptor)
```

## 整体设计

拦截器工作流程:
![]()

整个过程是一个链式调用的方式, 并且每个拦截器都可以支持同步和异步处理, 我们自然而然地想到使用 Promise 链的方式来实现整个调用过程。

在这个 Promise 链的执行过程中， 请求拦截器 `resolve` 函数处理的是 `config` 对象, 而响应拦截器 `resolve` 函数处理的是 `response` 对象。

在了解了拦截器工作流程后, 我们先要创建一个拦截器管理类, 允许我们去添加删除和遍历拦截器。

## 拦截器管理类实现

根据需求, `axios` 拥有一个 `intercepters` 对象属性, 该属性又有 `request` 和 `response` 2个属性, 他们对外提供一个 `use` 方法, 我们可以把这两个属性看做是一个拦截器管理对象。 `use` 方法支持 2 个参数, 第一个是 `resolve` 函数, 第二个是 `reject` 函数, 对于 `resolve` 函数的参数, 请求拦截器是 `AxiosRequestConfig` 类型的, 而响应拦截器是 `AxisoResponse` 类型的; 而对于 `reject` 函数的参数类型是 `any` 类型的。

根据上述分析, 我们先来定义一下拦截器管理对象对外的接口。

接口定义

`types/index.ts`

```ts
  export interface AxiosInterceptorManager<T> {
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
    eject(id: number): void
  }

  export interface ResolvedFn<T = any> {
    (val: T): T | Promise<T>
  }

  export interface RejectedFn {
    (error: any): any
  }
```

这里我们定义了 `AxiosInterceptorManager` 泛型接口, 因为对于 `resolve` 函数的参数, 请求拦截器和响应拦截器是不同的。

## 链式调用实现

当我们实现好拦截器管理类, 接下来就是在 `Axios` 中定义一个 `interceptors` 属性, 他的类型如下:

```ts
  interface Interceptors {
    request: InterceptorManager<AxiosRequireConfig>
    response: InterceptorManager<AxiosResponse>
  }
  export default class Axios {

    interceptors: Interceptors
    constructor() {
      this.interceptors = {
        request: new InterceptorManager<AxiosRequireConfig>(),
        response: new InterceptorManager<AxiosResponse>()
      }
    }
    ...
  }
```
一个 `Interceptors` 类型拥有两个属性, 一个请求拦截器管理类实例, 一个响应拦截器管理类实例。我们在实例化 `Axios` 类的时候，在构造函数中初始化这个 `interceptors` 实例属性。

`core/Axios.ts`

```ts
  interface PromiseChain<T> {
    resolved: ResolvedFn<T> | ((config: AxiosRequireConfig) => AxiosPromise)
    rejected?: RejectedFn
  }

  ...

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }
```