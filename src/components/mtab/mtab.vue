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
    <transition name="slide">
      <div class="back-img" v-show="showBg"></div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'mtab',
  data () {
    return {
      showBg: null
    }
  },
  methods: {
    routerPath () {
      this.showBg = this.$router.currentRoute.path === '/recommend'
    }
  },
  mounted () {
    this.showBg = this.$router.currentRoute.path === '/recommend'
  },
  watch: {
    '$route': 'routerPath'
  }
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
    font-size $font-size-ml
    color rgba(255, 255, 255, .5)
    .tab-item
      flex 1
      position relative
      text-align center
      .tab-link
        transition all .2s linear
      &:after
        content ''
        position absolute
        z-index 2
        bottom .12rem
        left 50%
        display block
        width 0
        height 2px
        border-radius .2rem
        background #fff
        transition all .2s linear
        transform translate(-50%)
      &.router-link-active:after
        width .4rem

      &.router-link-active
        .tab-link
          color $font-color-white

  .back-img
    position fixed
    width 100%
    top 1.76rem
    height 1.44rem
    background $color-linear-gradient

  .slide-enter, .slide-leave-to
    height 0
  .slide-enter-active, .slide-leave-active
    transition all .3s
</style>
