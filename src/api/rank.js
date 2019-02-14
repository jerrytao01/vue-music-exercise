import axios from 'axios'
import {url} from './config'

export function getTop (id) {
  const topUrl = url + `/top/list?idx=${id}`

  return axios.get(topUrl)
}
