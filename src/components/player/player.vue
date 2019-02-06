<template>
  <div class="player" v-show="playList.length>0">
    <div class="normal-player" v-show="fullScreen">
      播放器
    </div>
    <div class="mini-player" v-show="!fullScreen"></div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'player',
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .player
    .normal-player
      position fixed
      top 0
      right 0
      bottom 0
      left 0
      z-index 150
      background #fafafa
    .mini-player
      display flex
      align-items center
      position fixed
      left 0
      bottom 0
      z-index 160
      width 100%
      height 1.2rem
      box-shadow 0 -4px 10px rgba(112, 115, 123, .1)
</style>
