import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/shops/list',
    method: 'get',
    params: query
  })
}

export function fetchShop(id) {
  return request({
    url: '/shops/detail',
    method: 'get',
    params: { id }
  })
}

export function createShop(data) {
  return request({
    url: '/shops/create',
    method: 'post',
    data
  })
}

export function updateShop(data) {
  return request({
    url: '/shops/update',
    method: 'post',
    data
  })
}
