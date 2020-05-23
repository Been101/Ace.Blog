## 目标

- 实现 elForm
  - 指定数据、校验规则
- elFormItem
  - label 标签添加
  - 执⾏校验
  - 显示错误信息
- elInput
  - 维护数据

## el-input

维护数据

- 输入框输入的值， 或者是单选框，复选框选中的值， 亦或者是下拉菜单， datePicker 等值。

el-input 是对 input 的简单封装, el-input 的用法

```html
<el-input v-model="name"></el-input>
```

而 v-model= 'name' 是 :value = 'name' @input = 'name = value' 的语法糖

所以 el-input.vue 的简单实现可以是下面这样的。

`el-input.vue`

```html
<template>
  <input :value="value" @input="Oninput" />
</template>
<script>
  export default {
    data() {
      return {
        value: '',
      }
    },
    methods: {
      Oninput(e) {
        this.$emit('input', e.target.value)
      },
    },
  }
</script>
```

## el-form-item

el-form-item 对表单元素进行二次封装主要功能有 3 个

- 添加 label 标签
- 执行校验
- 显示错误信息

el-form-item 的基本用法可能是这样的

```html
<el-form-item lable = '用户名:'>
    <el-input v-model = 'name'>
</el-form-item>
```

el-form-item 中要显示的错误信息是由 el-form 的 rules 传入的，校验规则有可能有好多， 具体显示哪个是由 el-form-item 校验后选择的。

如校验规则有 2 条

- 必填项，不能为空
- 长度在 6 - 12 之间

经过校验 如果不符合第一条，则显示第一天错误信息， 否则显示第二条错误信息。

则 el-form-item 维护的 状态 有 error, 外部传入的状态有 label, rules。

又因为 el-form-item 中除了放 el-input 还可以放 el-checkbox, el-select 等，所以需要 用到 solt 进行插入。

`el-form-item.vue`

```html
<template>
  <div>
    <label>{{label}}</label>
    <slot></slot>
    <span v-if="error">{{error}}</span>
  </div>
</template>
<script>
  export default {
    props: {
      label: {
        type: String,
        default: '',
      },
      rules: {
        type: Array,
        default() {
          return []
        },
      },
    },
    data() {
      return {
        error: '',
      }
    },
  }
</script>
```

什么时候改变 error 的值，也就是说什么时候开始校验，是在 el-input 的值改变的时候, 我们需要 在 el-input 值改变的时候向外派发一个校验事件 validate

`el-input.vue`

```diff
 Oninput(e) {
   this.$emit('input', e.target.value)
+  this.$emit('validate', e.target.value) // 传入值并通知父元素可以校验啦
 }
```

el-form-item 中怎么监听这个事件呢，由于 el-input 是通过 slot 插入的， 在 slot 上添加 @validate= 'onValidate' 是监听不到的。

我们可以让 el-form-item 自己派发， 自己监听, 那么 `el-input.vue` 中应该修改成这样

```diff
Oninput(e) {
   this.$emit('input', e.target.value)
-  this.$emit('validate', e.target.value) // 传值并通知父元素可以校验啦
+  this.$parent.$emit('validate', e.target.value) // 让父组件自己 管理事件派发和监听
}
```

`el-form-item.vue`

此处执行校验用到了第三方库， `async-validate`, 提前 install, 并在 el-form-item.vue 中 import 进来。

```diff
+  mounted() {
+   this.$on('validate', (val) => this.validate(val))
+ }
methods: {
+   validate(val) {
+     // 拿到输入的值
+     // const value = val
+     // 拿到校验规则 rules， 父元素传进来的，直接用
+       const rules = this.rules
+     // 进行校验
+        if (!rules) {
+          return Promise.resolve(true);
+        }
+        // 创建描述对象
+        const descriptor = { [this.prop]: rules };
+        // 创建校验函数
+        const validator = new Schema(descriptor);
+        // 校验
+        return validator.validate({ [this.prop]: value }, errors => {
+          if (errors) {
+            this.error = errors[0].message;
+          } else {
+            this.error = "";
+          }
+        });
+   }
}
```

此时这样已经可以使用了，用法应该是这样的

```html
<template>
  <div>
    <el-form-item label="用户名" :rules="rules.name">
      <el-input v-model="name" />
    </el-form-item>
    <el-form-item label="密码" :rules="rules.password">
      <el-input v-model="password" />
    </el-form-item>
  </div>
</template>
<script>
  import Schema from 'async-validator'
  export default {
    data() {
      return {
        name: '',
        password: '',
        rulse: {
          name: [
            { required: true, message: '必填项， 不能为空' },
            { max: 12, min: 6, message: '长度在6-12之间' },
          ],
          password: [
            { required: true, message: '不填密码怎么登录' },
            { max: 6, message: '密码这么长， 能记得住吗' },
          ],
        },
      }
    },
  }
</script>
```

和咱们平时使用的 el-form-item 用法不太一样, 数据 model 和 规则 rules 都是由 el-form 管理的。

```html
<template>
  <div>
    <el-form :model="model" :rules="rules">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="model.name" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="model.password" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import Schema from 'async-validator'
  export default {
    data() {
      return {
        model: {
          name: '',
          password: '',
        },
        rulse: {
          name: [
            { required: true, message: '必填项， 不能为空' },
            { max: 12, min: 6, message: '长度在6-12之间' },
          ],
          password: [
            { required: true, message: '不填密码怎么登录' },
            { max: 6, message: '密码这么长， 能记得住吗' },
          ],
        },
      }
    },
  }
</script>
```

## el-form

el-form 的主要功能是指定数据和校验规则

用法就如同上面那样

el-form 的简单实现可能是这样的

`el-form.vue`

```html
<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      model: {
        type: Object,
        default() {
          return {}
        },
      },
      rules: {
        type: Object,
        default() {
          return {}
        },
      },
    },
  }
</script>
```

el-form 中的 model 和 rules 怎么传递给 el-form-item 和 el-input 呢，使用 provide 和 inject 进行 父和后代组件进行通信。

provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。所以我们把 this 传递下去， 后代组件拿到 el-form 组件实例之后就可以轻松访问 model， rules 等 属性和方法。

`el-form.vue`

```diff

<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
  export default {
+    provide() {
+      return {
+        form: this
+      }
+    },
    props: {
      model: {
        type: Object,
        default() {
          return {}
        },
      },
      rules: {
        type: Object,
        default() {
          return {}
        },
      },
    },
  }
</script>
```

而 el-form-item 中获取 value 和 rules 的方法就要改变一下了

el-input 派发 validate 事件的时候也不用 传值了

`el-input.vue`

```diff
- this.$parent.$emit('validate', e.target.value)
+ this.$parent.$emit('validate') // 只需要通知， 可以校验啦， 就行了

```

`el-form-item.vue`

```diff
export default {
+  inject: ['form'], // 注入祖先组件， 传进来的数据
  props: {
    label: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    }
  },
  mounted() {
-   this.$on('validate', (val) => this.validate(val))
+   this.$on('validate', () => this.validate())
  }
  methods: {
-    validate(val) {
+    validate() {
      // 拿到输入的值
-     const value = val  // 拿到对应的值
+     const value = this.form.model[this.prop] // 拿到对应的值
-      // 拿到校验规则 rules， 父元素传进来的，直接用
-        const rules = this.rules
+     const rules = this.form.rules[this.prop] // 拿到对应的规则

      // 进行校验
      if (!rules) {
        return Promise.resolve(true);
      }
      // 创建描述对象
      const descriptor = { [this.prop]: rules };
      // 创建校验函数
      const validator = new Schema(descriptor);
      // 校验
      return validator.validate({ [this.prop]: value }, errors => {
        if (errors) {
          this.error = errors[0].message;
        } else {
          this.error = "";
        }
      });
    }
  }
}

```

## 提交表单

form 表单的正确使用姿势可能是这样的

```html
<template>
  <div>
    <el-form ref="form" :model="model" :rules="rules">
      <el-form-item prop="name" label="用户名">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="model.password"></el-input>
      </el-form-item>
      <el-form-item>
        <button @click="checkForm">提交表单</button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    methods: {
      checkForm() {
        this.$refs.form.validate((valid: any) => {
          if (valid) {
            console.log('提交')
          } else {
            console.log('不能提交')
          }
        })
      },
    },
  }
</script>
```

提交表单需要主动校验所有规则， 需要给 form 添加 validate 方法。

`el-form.vue`

```js
validate(cb) {
  let flag = false
  const tasks = this.$children.map(item => item.prop) // 排除掉不需要校验的组件
  Promise.all(tasks).then(() => {
    flag = true
    cb(true)
  }).catch(err => {
     flag = false
      cb(true)
  })

}
```

## [完整的代码](https://github.com/Been101/blog-examples/tree/master/src/components/Form)
