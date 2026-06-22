export default defineAppConfig({
  pages: [
    'pages/today/index',
    'pages/prepare/index',
    'pages/handover/index',
    'pages/swap/index',
    'pages/rank/index',
    'pages/taskDetail/index',
    'pages/swapDetail/index',
    'pages/feedback/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F0F4F8',
    navigationBarTitleText: '光电帮',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#94A3B8',
    selectedColor: '#00C9A7',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/today/index',
        text: '今日任务'
      },
      {
        pagePath: 'pages/prepare/index',
        text: '准备清单'
      },
      {
        pagePath: 'pages/handover/index',
        text: '交接中心'
      },
      {
        pagePath: 'pages/swap/index',
        text: '换班广场'
      },
      {
        pagePath: 'pages/rank/index',
        text: '积分榜'
      }
    ]
  }
})
