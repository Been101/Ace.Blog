## 扩展 axios.create 静态接口

### 需求分析

目前为止，我们的 axios 都是一个单例，一旦我们修改了 axios 的默认配置，会影响所有的请求。我们希望提供一个 `axios.create` 的静态接口允许我们创建一个新的 `axios` 实例，同时允许我们传入新的配置和默认配置合并，并作为新的默认配置。

举个例子:

```ts

  const instance = axios.create({
    transformRequest: [(function(data){
      return qs.stringify(data)
    }), ...(axios.defaults.transfromRequest as AxiosTransformer[])],
    transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function () {
      if(typeof data === 'object') {
        data.b = 2
      }
      return data
    }]
  })

  instace({
    url: 'config/post',
    method: 'post',
    data: {
      a: 1
    }
  })
```

### 静态方法扩展

由于 `axios` 扩展了一个静态接口，因此我们先来修改接口类型定义。

`types/index.ts`

```ts
  export interface AxiosStatic extends AxiosInstance {
    create(config?: AxiosRequestConfig): AxiosInstance
  }
```
`create` 函数可以接受一个 `AxiosRequestConfig` 类型的配置，作为默认配置的扩展，也可以接受不传参数。

接着我们来实现 `axios.create` 静态方法。

`axios.ts`

```ts
  function createInstance(config: AxiosRequestConfig): AxiosStatic {
    const context = new Axios(config)
    const instance = Axios.prototype.request.bind(context)

    extend(instance, context)

    return instance as AxiosStatic
  }

  axios.create = function (config) {
    return createInstance(mergeConfig(defaults, config))
  }
```
内部调用了 `createInstance` 函数，并且把参数 `config` 与 `defaults` 合并，作为新的默认配置。注意这里我们需要 `createInstance` 函数的返回值类型为 `AxiosStatic`。










