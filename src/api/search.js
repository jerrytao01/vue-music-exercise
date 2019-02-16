import axios from 'axios'
import {url} from './config'

export function getSearchHot () {
  const hotUrl = url + `/search/hot`

  return axios.get(hotUrl)
}

export function getSearchSongs (name, page) {
  const songUrl = url + `/search?keywords=${name}&offset=${page}`

  return axios.get(songUrl)
}

export function getSearchSuggest (name) {
  const suggestUrl = url + `/search/suggest?keywords=${name}`

  return axios.get(suggestUrl)
}

export function getSongDetail (id) {
  const songDetailUrl = url + `/song/detail?ids=${id}`

  return axios.get(songDetailUrl)
}
