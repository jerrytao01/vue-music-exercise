<template>
  <div>
    <div class="music-tab">
      <router-link tag="div" to="/recommend" class="tab-item">
        <span class="tab-link">推荐</span>
      </router-link>
      <router-link tag="div" to="/singer" class="tab-item">
        <span class="tab-link">歌手</span>
      </router-link>
      <router-link tag="div" to="/rank" class="tab-item">
        <span class="tab-link">歌单</span>
      </router-link>
    </div>
    <div class="back-img"></div>
  </div>
</template>

<script>
export default {
  name: 'mtab'
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .music-tab
    position fixed
    top .88rem
    right 0
    bottom 0
    left 0
    display flex
    height .88rem
    line-height .88rem
    background $color-linear-gradient
    font-size $font-size-m
    color rgba(255, 255, 255, .5)
    .tab-item
      flex 1
      text-align center
      &.router-link-active
        .tab-link
          color $font-color-white
          font-size $font-size-ml

  .back-img
    position fixed
    width 100%
    top 1.76rem
    height 1.44rem
    background $color-linear-gradient
</style>
