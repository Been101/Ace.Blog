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