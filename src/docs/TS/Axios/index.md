## 响应数据支持泛型

### 需求分析

通常情况下， 我们会把后端返回数据格式单独放入一个接口中:
```ts
// 请求接口数据
export interface ResponseData< T = any > {
  /**
   *状态码
   *@type { number } 
   */
  code: number

  /**
   * 数据
   * @type { T }
   */
  result: T

  /**
   * 消息
   * @type { string }
   */
  message: string
}
```
我们可以把API抽离成单独的模块
```ts
import { ResponseData } from './iterface.ts'
export function getUser<T>() {
  return axios.get<ResponseData<T>('./somePath')
    .then(res => res.data)
    .catch(err => console.error(err))
}
```
接着我们写入返回的数据类型 User, 这可以让TypeScript 顺利推断出我们想要的类型:
```ts
interface User {
  name: string
  age: number
}

async function test() {
  // user 被推断出为
  // {
  //   code: number,
  //   result: {name: string, age: number},
  //   message: string
  // }
  const user = await getUser<User>()
}
```
### 接口添加泛型参数

根据需求分析， 我们需要给相关的接口定义添加泛型参数

types/index.ts

```ts

```

##
