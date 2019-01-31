<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="listDetail" :alia-name="aliaName"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {ERR_OK} from '../../api/config'
import {getSingerDetail} from '../../api/singer'
import {creatSong} from '../../common/js/song'
import MusicList from '../music-list/music-list'

export default {
  name: 'singer-detail',
  data () {
    return {
      songs: null,
      listDetail: []
    }
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.status === ERR_OK) {
          this.songs = res.data.hotSongs
        }
      })
    },
    _normalizeSongs (list) {
      let result = []
      list.forEach((item) => {
        result.push(creatSong(item))
      })
      return result
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    aliaName () {
      return this.singer.aliaName
    },
    ...mapGetters([
      'singer'
    ])
  },
  watch: {
    songs (newVal) {
      this.listDetail = this._normalizeSongs(newVal)
    }
  },
  created () {
    this._getSingerDetail()
  },
  components: {MusicList}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .slide-enter-active, .slide-leave-active
    transition all .3s ease-out
</style>
