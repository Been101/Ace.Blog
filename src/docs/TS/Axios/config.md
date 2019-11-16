## 合并配置话的设计与实现

### 需求分析

在前面我们了解到，我们在发送请求的时候可以传入一个配置，来决定请求的不同行为。我们也希望 `ts-axios` 可以有默认配置，定义一些默认的行为。这样在发送每个请求，用户传递的配置可以和默认配置做一层合并。

和官网 `axios` 库保持一致， 我们给 `axios` 对象添加一个 `default` 属性，表示默认配置，你甚至可以直接修改这些默认配置:

```ts
  axios.defaults.headers.common['test'] = 123
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  axios.defaults.timeout = 2000
```
其中对于 `headers` 的默认配置支持 `common` 和一些请求 `method` 字段，`common` 表示对于任何类型的请求都要添加该属性，而 `method` 表示只有该类型的请求方法才会添加对应的属性。

在上述例子中，我们会默认为所有请求的 `header` 添加 `test` 属性，会默认为 `post` 请求的 `header`  添加 `Content-Type` 属性。

## 默认配置

### 默认配置定义

接下来，我们先实现默认配置

`defaults.ts`

```ts
import { AxiosRequireConfig } from './types/index';

const defaults: AxiosRequireConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
}

const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults

```
## 配置合并及策略

定义了默认配置后，我们发送请求的时候需要把自定义配置和默认配置做合并。他并不是简单的 2 个普通对象的合并，对于不同的字段有不同的合并策略。举个例子:
```ts
  config1 = {
    method: 'get',
    timeout: 0,
    headers: {
      common: {
        Accept: 'application/json, text/plain, */*'
      }
    }
  }
  config2 = {
    url: '/merge/api',
    method: 'post',
    data: {
      name: 'ming'
    }
    headers: {
      test: 'test header field'
    }
  }

  merged = {
    url: '/merge/api'
    method: 'post',
    timeout: 0,
    data: {
      name: 'ming'
    },
    headers: {
      test: 'test header field',
      common: {
        Accept: 'application/json, text/plain, */*'
      }
    }
  }
```
我们在 `core/mergerConfig.ts` 实现合并方法

## 合并方法
```ts
```
## flatten header

经过合并后的配置中 `headers` 是一个复杂对象， 多了 `common` `post` `get` 等属性，而这些属性中的值才是我们要真正添加到 `header` 中的。

举个例子:
```ts
  header: {
    common: {
      Accept: 'application/json, text/plain, */*'
    },
    post: {
      'Content-Type': 'application/x-www-from-urlencoded'
    }
  }
```
我们需要把他压成一级，如下:

```ts
  headers: {
    Accept: 'application/json, text/plain, */*', 'Content-Type: application/x-www-from-urlencoded'
  }
```
这里要注意的是，对于 `common` 中定义的 ` header` 字段，我们都要提取，对于 `post` `get` 这类字段的提取，需要和该次请求方法对应。

接下来实现 `flattenHeaders` 方法。

`helps/headers.ts`

```ts

```