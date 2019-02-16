<template>
  <div class="music-header">
    <div class="header-wrapper">
      <div class="more-wrapper">
        <span class="iconfont icon-more more"></span>
      </div>
      <div class="title-wrapper">VUEMUSIC</div>
      <div class="search-wrapper" @click="searchEvent">
        <span class="iconfont icon-Oval search"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'music-header',
  methods: {
    searchEvent () {
      this.$router.push('/search')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .music-header
    box-sizing border-box
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    padding 0 .24rem
    background: $color-linear-gradient
    height .88rem
    .header-wrapper
      display flex
      height 100%
      .more-wrapper
        width .8rem
        line-height .88rem
        color $font-color-white
        .more
          display block
      .title-wrapper
        flex 1
        height 100%
        line-height .88rem
        color $font-color-white
        text-align center
        font-size $font-size-m
      .search-wrapper
        width .8rem
        line-height .88rem
        color $font-color-white
        margin-right auto
        .search
          float right
</style>
