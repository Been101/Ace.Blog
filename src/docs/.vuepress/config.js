module.exports = {
  base: '/Ace.Blog/',
  dest: 'dist',
  title: 'Ace',
  description: 'ace blog',
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  serviceWorker: false,
  themeConfig: {
    repo: 'Been101/Ace.Blog',
    editLinks: true,
    docsDir: 'src/docs',
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    nav: [
      {
        text: 'JS/TS',
        items: [
          { text: 'Axios', link: '/TS/Axios/' }
        ]
      },
      {
        text: '数据结构和算法',
        items: [
              { text: 'DataStructure', link: '/DataStructure/DataStructure/' },
            ]
      },
      // {
      //   text: 'React',
      //   link: '/nav/index/'
      // },
      // {
      //   text: 'Vue',
      //   items: [
      //     { text: 'SSR', link: '/vue/SSR/' },
      //   ]
      // },
      // {
      //   text: 'Webpack',
      //   items: [
      //     { text: 'SSR', link: '/vue/SSR/' },
      //   ]
      // },
      // {
      //   text: 'Jenkins',
      //   items: [
      //     { text: 'SSR', link: '/vue/SSR/' },
      //   ]
      // },
      // {
      //   text: 'Charts',
      //   items: [
      //     { text: 'SSR', link: '/vue/SSR/' },
      //   ]
      // },
    ],
    sidebar: {
      // '/vue/': [
      //   {
      //     title: 'SSR',
      //     collapsable: false,
      //     children: [
      //       ['SSR/', 'Introduction']
      //     ]
      //   }
      // ],
      '/TS/': [
        {
          title: 'TS-Axios',
          collapsable: false,
          children: [
            ['Axios/', 'ts-axios接口扩展'],
            'Axios/interceptor',
            'Axios/config',
            'Axios/customRequestAndResponse',
            'Axios/create',
            'Axios/cancel'
          ]
        }
      ],
      '/DataStructure/': [
        {
          title: '数据结构和算法',
          collapsable: false,
          children: [
            ['DataStructure/', '介绍'],
            'DataStructure/Stack',
            'DataStructure/Queue',
          ]
        }
      ]
    }
  }
}