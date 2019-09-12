import Layout from '@/layout'

const tableRouter = {
  path: '/settings',
  component: Layout,
  redirect: '/shops/index',
  name: 'Settings',
  meta: {
    title: '設定',
    icon: 'lock'
  },
  children: [
    {
      path: 'shops',
      component: () => import('@/views/shops/index'),
      name: 'ShopsIndex',
      meta: {
        title: '店舗'
      }
    },
    {
      path: ':id(\\d+)/edit',
      component: () => import('@/views/shops/edit'),
      name: 'ShopsEdit',
      meta: { title: 'ショップ詳細設定', noCache: true, activeMenu: '/settings/shops' },
      hidden: true
    },
    {
      path: 'malls',
      component: () => import('@/views/malls/index'),
      name: 'MallsIndex',
      meta: {
        title: 'モール'
      }
    }
  ]
}
export default tableRouter
