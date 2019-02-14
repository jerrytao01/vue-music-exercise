import axios from 'axios'
import {url} from './config'

export function getSong (id) {
  const songUrl = url + `/song/url?id=${id}`

  return axios.get(songUrl)
}

export function getLyric (id) {
  const lyricUrl = url + `/lyric?id=${id}`

  return axios.get(lyricUrl)
}

export function getSongList (id) {
  const songListUrl = url + `/playlist/detail?id=${id}`
  return axios.get(songListUrl)
}
