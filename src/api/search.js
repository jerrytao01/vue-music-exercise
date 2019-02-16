import axios from 'axios'
import {url} from './config'

export function getSearchHot () {
  const hotUrl = url + `/search/hot`

  return axios.get(hotUrl)
}
