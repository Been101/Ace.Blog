# SSR （Server Side Render）
服务端将Vue组件渲染为HTML 字符串，并将html字符串直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

## 优点
- 更好的SEO， 由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面
- 更快的内容到达时间

## 缺点
- 开发条件受限。 （服务端只执行beforeCreated 和 created 生命周期函数， 并且没有window, DOM, BOM等）。
- 涉及构建设置和部署的更多要求，需要处于node server的运行环境
- 更多的服务端负载

## SSR精髓
- 服务端将Vue组件渲染为HTML 字符串，并将html字符串直接发送到浏览器
- 独立的应用程序实例，以便不会有交叉请求造成的状态污染

## 大致分为一下几种情况
- 直接将Vue 组件渲染为html字符串并返回给浏览器
- 不同路由下返回不同的页面
- Vue组件中初始化时含有异步请求
- 一个完整的Vue SSR(包括Vue Router, axios, Vuex)

## 先创建一个简单的vue项目 [代码地址 01]( https://github.com/Been101/Vue.SSR/tree/master/01)

```
|—— components  //  子组件
|   |—— Foo.vue   
|   |—— Bar.vue
|   
|—— App.vue    // 根组件
|—— index.js   // 入口文件
|—— webpack.config.js
```
代码很简单就是一个很普通的vue项目。(包括一些点击事件，数据绑定)

## 直接渲染Vue 组件成html 字符串并返回 [代码地址 02/demos](https://github.com/Been101/Vue.SSR/tree/master/02)
 官方提供一个插件 vue-server-renderer 可以直接将vue 实例渲染成 Dom 标记
 ### demo1
 ```js
    const Vue = require('vue')
    const app = new Vue({
      template: `<div>Hello World</div>`
    })
    
    // 第 2 步：创建一个 renderer
    const renderer = require('vue-server-renderer').createRenderer()
    
    // 第 3 步：将 Vue 实例渲染为 HTML
    renderer.renderToString(app, (err, html) => {
      if (err) throw err
      console.log(html)
      // => <div data-server-rendered="true">Hello World</div>
    })
    
    // 在 2.5.0+，如果没有传入回调函数，则会返回 Promise：
    renderer.renderToString(app).then(html => {
      console.log(html)
    }).catch(err => {
      console.error(err)
    })
 ```
 ### demo2
 与服务端结合， 通过请求返回html 页面
 ```js
    const Vue = require('vue')
    const Koa = require('koa');
    const Router = require('koa-router');
    const renderer = require('vue-server-renderer').createRenderer()
    
    const app = new Koa();
    const router = new Router();
    
    router.get('*', async (ctx, next) => {
      const app = new Vue({
        data: {
          url: ctx.request.url
        },
        template: `<div>访问的 URL 是： {{ url }}</div>`
      })
    
      renderer.renderToString(app, (err, html) => {
        if (err) {
          ctx.status(500).end('Internal Server Error')
          return
        }
        ctx.body = `
          <!DOCTYPE html>
          <html lang="en">
            <head><title>Hello</title></head>
            <body>${html}</body>
          </html>
        `
      })
    })
    
    app
      .use(router.routes())
      .use(router.allowedMethods());
    app.listen(8080, () => {
      console.log('listen 8080')
    })
 ```
 从demo1 可以看出vue-server-renderer 方法返回的是一个html 片段 官方叫标记（markup）， 并不是完整的html 页面。
 我们必须像demo2中那样用一个额外的 HTML 页面包裹容器，来包裹生成的 HTML 标记。
 
 我们可以提供一个模板页面。例如
 ```html
 <!DOCTYPE html>
<html lang="en">
  <head><title>Hello</title></head>
  <body>
    <!--vue-ssr-outlet-->  
  </body>
</html>
 ```
 注意 ```<!--vue-ssr-outlet-->``` 注释这里将是应用程序 HTML 标记注入的地方。 这是插件提供的，如果不用  ```<!--vue-ssr-outlet-->```也是可以的，那就要自己去简单处理一下了。
 ### demo3
 ```html
  <!DOCTYPE html>
    <html lang="en">
      <head><title>Hello</title></head>
      <body>
        {injectHere}
      </body>
    </html>
 ```
 #### demo3.js
 ```js
 const template = require('fs').readFileSync(path.resolve(__dirname, './index.template.html'), 'utf-8')
 ctx.body = template.replace('{injectHere}', html)
 ```
 
 ### 需要注意几点：
 - 服务器渲染的 Vue.js 应用程序也可以被认为是"同构"或"通用"，因为应用程序的大部分代码都可以在服务器和客户端上运行。
 - 在纯客户端应用程序 (client-only app) 中，每个用户会在他们各自的浏览器中使用新的应用程序实例。对于服务器端渲染，我们也希望如此：每个请求应该都是全新的、独立的应用程序实例，以便不会有交叉请求造成的状态污染 (cross-request state pollution)
 #### 对于第一点: 
- 既然在客户端和服务端上都能运行，那应该有两个入口文件。一些 Dom, Bom 的操作在服务端肯定是不行的.

- 通常 Vue 应用程序是由 webpack 和 vue-loader 构建，并且许多 webpack 特定功能不能直接在 Node.js 中运行（例如通过 file-loader 导入文件，通过 css-loader 导入 CSS）
 #### 对于第二点：
- 需要将其包装为一个工厂函数，每次调用都会生成一个全新的根组件

app.js
```js
    import Vue from 'vue'
    import App from './App.vue'
    
    export function createApp() {
        const app = new Vue({
            render: h => h(App)
        })
        return { app }
    }
```
enter-client.js
```js
    import { createApp } from './app.js'
    
    const { app } = createApp()
    
    // App.vue 模板中根元素具有 `id="app"`
    app.$mount('#app')
```
enter-server.js
```js
    import { createApp } from './app.js';
    
    export default context => { // koa 的 context
        const { app } = createApp()
        return app
    }
```
```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>服务端渲染</title>
    </head>
    <body>
      <!--vue-ssr-outlet-->
      <!-- 引入客户端打包后的js文件(client.bundle.js) -->
      <script type="text/javascript" src="<%= htmlWebpackPlugin.options.files.js %>"></script>
    </body>
    </html>
```
webpack.server.config.js
```js
    const path = require('path');
    const merge = require('webpack-merge');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const base = require('./webpack.base.config');
    
    module.exports = merge(base, {
        // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
        // 并且还会在编译 Vue 组件时，
        // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
      target: 'node',
      entry: {
        server: path.resolve(__dirname, '../entry-server.js')
      },
      output: {
          // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
        libraryTarget: 'commonjs2'
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, '../../index.ssr.html'),
          filename: 'index.ssr.html',
          files: {
            js: 'client.bundle.js' // index.ssr.html 中引入的js文件是客户端打包出来的client.bundle.js。这是因为 Vue 需要在浏览器端接管由服务端发送的静态 HTML，使其变为由 Vue 管理的动态 DOM。这个过程官方称为客户端激活
          },
          excludeChunks: ['server']
        })
      ]
    });
```
webpack.cliient.config.js
```js
    const path = require('path')
    const merge = require('webpack-merge')
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    const base = require('./webpack.base.config')
    
    module.exports = merge(base, {
        entry: {
            client: path.resolve(__dirname, '../entry-client.js')
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../../index.html'),
                filename: 'index.html'
            })
        ]
    })
```
这是比较完整的 客户端接管由服务端渲染Vue 实例发送的静态 HTML，并由 Vue 管理的动态Dom 的例子。[完整代码 03](https://github.com/Been101/Vue.SSR/tree/master/03)

## 引入路由router 的服务端渲染

Vue 项目的路由管理由vue-router 来负责，和 02 项目一样， 服务端返回渲染后的html, 剩下的就交给Vue了。

router.js 
```js
    import Vue from 'vue'
    import Router from 'vue-router'
    import Bar from "./components/Bar.vue";
    import Foo from "./components/Foo.vue";
    const routes = [
      { path: '/foo', component: Foo },
      { path: '/bar', component: Bar }
    ]
    
    Vue.use(Router)
    
    export function createRouter() {
      // 创建 router 实例，然后传 `routes` 配置
      // 你还可以传别的配置参数, 不过先这么简单着吧。
      return new Router({
        mode: 'history',
        routes
      })
    }
```
app.js 引入router
```js
    import Vue from 'vue'
    import App from './App.vue'
    import { createRouter } from './router'
    
    // 导出一个工厂函数，用于创建新的
    // 应用程序、router 和 store 实例
    export function createApp() {
        // 创建 router 实例
        const router = createRouter()
        const app = new Vue({
            // 注入 router 到根 Vue 实例
            router,
            // 根实例简单的渲染应用程序组件。
            render: h => h(App)
        })
        return { app, router }
    }
```
这样就可以了码， 显然还不够，Vue 优化上，我们一般会选择惰性加载组件，而不是一下子全部加载。那我们就需要简单修改一下entry-server.js 和 router.js 文件了。

router.js
```js
    import Vue from 'vue'
    import Router from 'vue-router'
    
    const routes = [
     // webpack.base.config.js 中需要配置 @babel/plugin-syntax-dynamic-import
      { path: '/foo', component: () => import('./components/Foo.vue') }, 
      { path: '/bar', component: () => import('./components/Bar.vue') }
    ]
    
    Vue.use(Router)
    
    export function createRouter() {
      // 创建 router 实例，然后传 `routes` 配置
      // 你还可以传别的配置参数, 不过先这么简单着吧。
      return new Router({
        mode: 'history',
        routes
      })
    }
```
由于加入了异步路由钩子函数或组件，所以我们将返回一个 Promise，以便服务器能够等待所有的内容在渲染前，就已经准备就绪。
我们现在的entry-server.js 更新成这样

entry-server.js 

```js
    import { createApp } from './app.js';
    
    export default context => {
        // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
        // 以便服务器能够等待所有的内容在渲染前，
        // 就已经准备就绪。
        return new Promise((resolve, reject) => {
            const { app, router } = createApp()
            if (context.url.indexOf('.') === -1) { // 防止匹配 favicon.ico   *.js 文件
                router.push(context.url)
            }
            // 设置服务器端 router 的位置
    
            console.log(context.url, '******')
            // 等到 router 将可能的异步组件和钩子函数解析完
            router.onReady(() => {
                const matchedComponents = router.getMatchedComponents()
                // 匹配不到的路由，执行 reject 函数，并返回 404
                if (!matchedComponents.length) {
                    return reject({ code: 404 })
                }
    
                // Promise 应该 resolve 应用程序实例，以便它可以渲染
                resolve(app)
            }, reject)
        })
    }
```
entry.client.js
```js
    import { createApp } from './app.js'
    
    const { app, router } = createApp()
    
    router.onReady(() => {
      // 这里假定 App.vue 模板中根元素具有 `id="app"`
      app.$mount('#app')
    })
```
由于用到了，异步路由这个时候，打包的bundle.js不包括异步组件的js文件。还按照上面直接引入 server.bundle.js 的话，会报错找不到相关的异步组件的js文件。

所以这里我们用vue-server-renderer下的插件vue-server-renderer/server-plugin把server.entry.js文件打包成一个json 文件， 而json 文件中会把所有的异步组件和相关的js一一map。

## 需要初始化数据的服务端渲染

在服务器端渲染(SSR)期间，我们本质上是在渲染我们应用程序的"快照"，所以如果应用程序依赖于一些异步数据，那么在开始渲染过程之前，需要先预取和解析好这些数据。

另一个需要关注的问题是在客户端，在挂载 (mount) 到客户端应用程序之前，需要获取到与服务器端应用程序完全相同的数据 - 否则，客户端应用程序会因为使用与服务器端应用程序不同的状态，然后导致混合失败。

为了解决这个问题，获取的数据需要位于视图组件之外，即放置在专门的数据预取存储容器(data store)或"状态容器(state container)）"中。首先，在服务器端，我们可以在渲染之前预取数据，并将数据填充到 store 中。此外，我们将在 HTML 中序列化(serialize)和内联预置(inline)状态。这样，在挂载(mount)到客户端应用程序之前，可以直接从 store 获取到内联预置(inline)状态。

我们用官方的状态管理库 的VueX 。

store.js
```js
    import Vue from 'vue'
    import Vuex from 'vuex'
    
    Vue.use(Vuex)
    
    // 一个可以返回 Promise 的 API
    import { fetchItem } from './api'
    
    export function createStore () {
      return new Vuex.Store({
        state: {
          items: {}
        },
        actions: {
          fetchItem ({ commit }, id) {
            // `store.dispatch()` 会返回 Promise，
            // 以便我们能够知道数据在何时更新
            return fetchItem(id).then(item => {
              commit('setItem', { id, item })
            })
          }
        },
        mutations: {
          setItem (state, { id, item }) {
            Vue.set(state.items, id, item)
          }
        }
      })
    }
```

app.js
```js
    import Vue from 'vue'
    import App from './App.vue'
    import { createRouter } from './router'
    import { createStore } from './store'
    
    // 导出一个工厂函数，用于创建新的
    // 应用程序、router 和 store 实例
    export function createApp() {
        const router = createRouter()
        const store = createStore()
        const app = new Vue({
            router,
            store,
            // 根实例简单的渲染应用程序组件。
            render: h => h(App)
        })
        return { app, router, store }
    }
```

那么，我们在哪里放置「dispatch 数据预取 action」的代码？

我们需要通过访问路由，来决定获取哪部分数据 - 这也决定了哪些组件需要渲染。事实上，给定路由所需的数据，也是在该路由上渲染组件时所需的数据。所以在路由组件中放置数据预取逻辑，是很自然的事情。

我们将在路由组件上暴露出一个自定义静态函数 asyncData。注意，由于此函数会在组件实例化之前调用，所以它无法访问 this。需要将 store 和路由信息作为参数传递进去：


















































