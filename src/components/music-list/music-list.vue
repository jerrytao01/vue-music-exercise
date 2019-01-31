<template>
  <div class="music-list">
    <div class="back" @click="backToSinger">
      <span class="iconfont icon-back-icon icon-back"></span>
      <span class="back-title">返回</span>
    </div>
    <div class="background-img" ref="bgImg">
      <img class="singer-img" :src="bgImage" alt="">
      <p class="singer-name">{{title}}<span v-show="aliaName.length">({{aliaName}})</span></p>
    </div>
    <scroll class="list" ref="list">
      <div class="music-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../../base/scroll/scroll'
import SongList from '../../base/song-list/song-list'
export default {
  name: 'music-list',
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: function () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    aliaName: {
      type: String,
      default: ''
    }
  },
  methods: {
    backToSinger () {
      this.$router.back()
    }
  },
  mounted () {
    this.$refs.list.$el.style.top = `${this.$refs.bgImg.clientHeight}px`
  },
  components: {SongList, Scroll}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .music-list
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    background #fafafa
    .back
      position absolute
      top .2rem
      left .24rem
      width 100%
      z-index 10
      color #fff
      .back-title
        float left
        font-size $font-size-m
      .icon-back
        float left
        font-size $font-size-m
    .background-img
      position relative
      width 100%
      height 0
      padding-top 81.3%
      overflow hidden
      .singer-img
        position absolute
        top 0
        left 0
        width 100%
        vertical-align middle
      .singer-name
        position absolute
        left .24rem
        bottom .48rem
        color #fff
        font-size $font-size-xl
    .list
      position absolute
      top 0
      bottom 0
      width 100%
      background: #fafafa
      overflow hidden
</style>
