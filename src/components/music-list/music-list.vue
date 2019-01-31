<template>
  <div class="music-list">
    <div class="back" @click="backToSinger">
      <span class="iconfont icon-back-icon icon-back"></span>
      <span class="back-title">返回</span>
    </div>
    <div class="background-img">
      <img class="singer-img" :src="bgImage" alt="">
      <p class="singer-name">{{title}}<span v-show="aliaName.length">({{aliaName}})</span></p>
    </div>
  </div>
</template>

<script>
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
  }
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
        bottom .1rem
        color #fff
        font-size $font-size-xl
</style>
