<template>
  <div>
    <listview :list="singers" @select="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'
import {ERR_OK, url} from '../../api/config'
import Singer from '../../common/js/singer'
import Listview from '../../base/listview/listview'
import {mapMutations} from 'vuex'

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
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
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
            aliaName: item.alias[0],
            bgImage: item.picUrl
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
          aliaName: item.alias[0],
          bgImage: item.picUrl
        }))
      })
      // 对有序列表的处理
      let hot = [] // 热门歌手
      let ret = [] // 排序A-Z的数据
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  created () {
    this._getSinger()
  },
  components: {Listview}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
