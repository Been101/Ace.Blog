## 取消功能的设计与实现

### 需求分析

有些场景下，我们希望能主动取消请求，比如常见的搜索框案例，在用户输入过程中，搜索框的内容在不断的变化，正常情况下每次变化我们都应该向服务器发送一次请求。但是当用户的输入过快的话，我们不希望每次变化请求都发出去，通常一个解决方案是前端用 debounce 的方案，比如延时 200ms 发送请求。这样当用户连续输入的字符，只要输入间隔小于 200ms，前面输入的字符都不会发请求。

但是还有一种极端情况是后端接口很慢，比如超过 1s 才能响应，这个时候即使做了 200ms 的 debounce , 但是在我慢慢输入 （每个输入间隔都超过200ms）的情况下，在前面的请求没有响应前，也有可能发出去多个请求。因为接口的影响时长是不定的，如果先发出去的请求响应时长比后发出去的请求要久一些，后请求的响应先回来，先请求的响应后回来，就会出现前面请求响应结果覆盖后面请求响应结果的情况，那么就乱了。因此在这个场景下，我们除了做 debounce， 还希望后面的请求发出去的时候， 如果前面的请求还没有响应， 我们可以把前面的请求取消。

从axios 取消接口设计层面， 我们希望做如下设计:
```ts
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  axios.get('/useer/123', {
    cancelToken: source.token
  }).catch( e => {
    if(axios.isCancel(e)) {
      console.log('Request cancel', e.message)
    }else {
      // 处理错误
    }
  })

  // 取消请求 （取消原因是可选的）
  source.cancel('Operation caceled by the user.')
```
我们给 `axios` 添加一个 `CancelToken` 的对象，他有一个 `source` 方法可以返回一个 `source` 对象，`source.token` 是在每次请求的时候传给配置对象中的 `cancelToken` 属性，然后在请求发出去之后，我们可以通过 `source.cancel` 方法取消请求。

我们还支持另一种方式的调用:

```ts
  const CancelToken = axios.CancelToken
  let cancel;

  axios.get('/user/123', {
    cancelToken: new CancelToken(function executor(c) {
      cancel = c
    })
  })

  // 取消请求
  cancel()
```

## 异步分离的设计方案

通过需求分析，我们知道想要实现取消某次请求，我们需要为该请求配置一个 `cancelToken`, 然后在外部调用一个 `cancel` 方法。

请求的发送是一个异步过程，最终会执行 `xhr.send` 方法， `xhr` 对象提供了 `abort` 方法，可以把请求取消。因为我们在外部是碰不到 `xhr` 对象的，所以我们想在执行 `cancel` 的时候，去执行 `xhr.abort` 方法。

现在就相当于我们在 `xhr` 异步请求过程中插入一段代码，当我们在外部执行 `cancel` 函数的时候，会驱动这段代码的执行，然后执行 `xhr.abort`方法取消请求。

我们可以利用 Promise 实现异步分离，也就是在 `cancelToken` 中保存一个 `pending` 状态的 Promise 对象，然后当我们执行 `cancel` 方法的时候，能够访问到这个 Promise 对象，把他从 `pending` 状态变成 `resolved` 状态， 这样我们就可以在 `then` 函数中去实现取消请求的逻辑，类似如下的代码:

```ts 
  if(cancelToken) {
    cancelToken.promise
      .then(reason => {
        request.abort()
        reject(reason)
      })
  }
```

## CancelToken 类的实现

接下来，就来实现这个 `CancelToken` 类，先来看一下接口定义:

### 接口定义
