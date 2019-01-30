import axios from 'axios'
import {url} from './config'

export function getSingerDetail (singerId) {
  const detailUrl = url + `/artists?id=${singerId}`
  return axios.get(detailUrl)
}
