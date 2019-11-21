# Config

## `.vscode/settings.json`

```
{    
    "typescript.tsdk": "node_modules\\typescript\\lib",
    "editor.tabSize": 2,
    "eslint.validate": [
        {
            "language": "vue",
            "autoFix": true
        },
        {
            "language": "javascript",
            "autoFix": true
        },
        {
            "language": "javascriptreact",
            "autoFix": true
        },
        {
            "language": "typescript",
            "autoFix": true
        }
    ],
    "eslint.autoFixOnSave": true,
    "vetur.validation.template": true
}
```

# gizmoball

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

其它命令请看`package.json`的scripts

# 一些链接

[npm 迁移至 yarn](https://yarnpkg.com/zh-Hans/docs/migrating-from-npm?tdsourcetag=s_pctim_aiomsg#toc-cli-commands-comparison)

[TypeScript 3.7 新特性](https://devblogs.microsoft.com/typescript/announcing-typescript-3-7-beta/)

[TypeScript 查找第三方JS库声明文件](https://microsoft.github.io/TypeSearch/) （当库作者未提供TS声明文件时再查找）

[Vue-class 单文件组件示例](https://github.com/vuejs/vue-class-component/blob/master/example/src/App.vue)

[electron 文档](https://electronjs.org/docs)

词穷了？[变量命名](https://unbug.github.io/codelf/)

# VSCode 推荐扩展

    ✨ESlint

    ✨Vetur

    Auto Close Tag

    Auto Rename Tag

    Bracket Pair Colorizer

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
