<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="listDetail"></music-list>
  </transition>
</template>

<script>
import MusicList from '../music-list/music-list'
import {mapGetters} from 'vuex'
import {creatSong} from '../../common/js/song'

export default {
  name: 'toplist',
  data () {
    return {
      listDetail: []
    }
  },
  methods: {
    _normalizeSongs (list) {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      let ret = []
      list.forEach((item) => {
        ret.push(creatSong(item))
      })
      this.listDetail = ret
    }
  },
  computed: {
    title () {
      return this.topList.name
    },
    bgImage () {
      return this.topList.coverImgUrl
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    if (!this.topList.id) {
      this.$router.push('/rank')
    }
    this._normalizeSongs(this.topList.tracks)
    this.probeType = 3
    this.listenScroll = true
  },
  components: {MusicList}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
