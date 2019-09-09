import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@first',
    'mall_id|1': ['1', '2'],
    'status|1': ['1', '2'],
    started_at: +Mock.Random.date('T'),
    created_at: +Mock.Random.date('T'),
    updated_at: +Mock.Random.date('T'),
    deleted_at: null
  }))
}

export default [
  {
    url: '/shops/list',
    type: 'get',
    response: config => {
      const { mall_id, status, name, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (mall_id && item.mall_id !== mall_id) return false
        if (status && item.status !== status) return false
        if (name && item.name.indexOf(name) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/shops/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const shop of List) {
        if (shop.id === +id) {
          return {
            code: 20000,
            data: shop
          }
        }
      }
    }
  },

  {
    url: '/shops/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/shops/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

