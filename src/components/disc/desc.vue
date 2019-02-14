<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="listDetail"></music-list>
  </transition>
</template>

<script>
import MusicList from '../music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from '../../api/song'
import {ERR_OK} from '../../api/config'
import {createRecommendListSong} from '../../common/js/song'

export default {
  name: 'disc',
  data () {
    return {
      listDetail: []
    }
  },
  methods: {
    _getRecommendListDetail (id) {
      if (!id) {
        this.$router.push('/recommend')
        return
      }
      getSongList(id).then((res) => {
        if (res.status === ERR_OK) {
          this.listDetail = res.data.playlist.tracks.map((item) => {
            return createRecommendListSong(item)
          })
        }
      })
    }
  },
  computed: {
    title () {
      return this.disc.name
    },
    bgImage () {
      return this.disc.picUrl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    this._getRecommendListDetail(this.disc.id)
    this.probeType = 3
    this.listenScroll = true
  },
  components: {MusicList}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
