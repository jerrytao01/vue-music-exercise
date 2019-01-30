<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {ERR_OK} from '../../api/config'
import {getSingerDetail} from '../../api/singer'
import {creatSong} from '../../common/js/song'

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
    ...mapGetters([
      'singer'
    ])
  },
  watch: {
    songs (newVal) {
      this.listDetail = this._normalizeSongs(newVal)
      console.log(this.listDetail)
    }
  },
  created () {
    this._getSingerDetail()
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .singer-detail
    position fixed
    z-index 10
    top 0
    right 0
    bottom 0
    left 0
    background: #666
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .slide-enter-active, .slide-leave-active
    transition all .3s ease-out
</style>
