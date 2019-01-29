<template>
  <div>singer页面</div>
</template>

<script>
import axios from 'axios'
import {ERR_OK, url} from '../../api/config'
import Singer from '../../common/js/singer'

const singUrl = '/top/artists'
const limit = 'limit=100'
const HOT_NAME = '热门'
const HOT_SINGERS_LENGTH = 10
const pinyin = require('pinyin')

export default {
  name: 'singer',
  data () {
    return {
      singers: null
    }
  },
  methods: {
    _getSinger () {
      axios.get(url + singUrl + '?' + limit).then((res) => {
        if (res.status === ERR_OK) {
          let singers = []
          res.data.artists.forEach((item) => {
            if (item.name[0] !== '蔡') {
              singers.push(item)
            }
          })
          singers.map((item) => {
            let py = pinyin(item.name[0], {
              style: pinyin.STYLE_FIRST_LETTER
            })
            item.toFirstLetter = py[0][0].toUpperCase()
          })
          this.singers = this._normalizeSinger(singers)
          console.log(this.singers)
        }
      })
    },
    _normalizeSinger (list) {
      let map = { // 创建一个对象，记录热门歌手数据
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => { // 热门歌手数据取前十条
        if (index < HOT_SINGERS_LENGTH) {
          map.hot.items.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias[0]
          }))
        }

        const key = item.toFirstLetter // 记录key值
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.id,
          name: item.name,
          avatar: item.img1v1Url,
          aliaName: item.alias[0]
        }))
      })
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[A-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  },
  created () {
    this._getSinger()
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
