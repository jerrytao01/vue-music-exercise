<template>
  <div class="player" v-show="playList.length>0">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <div class="mask"></div>
        <img width="100%" height="100%" :src="currentSong.image">
      </div>
      <div class="top">
        <span class="iconfont icon-under-arrow under-arrow" @click="back"></span>
        <h2 class="top-title">{{currentSong.name}}</h2>
      </div>
      <p class="singer">{{currentSong.singer}}</p>
      <div class="album-wrapper">
        <div class="img-wrapper">
          <div class="cd-img-wrapper">
            <img class="cd-img" :src="currentSong.image" alt="">
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="lyric">
          <p class="lyric-desc">总是学不会，再聪明一点</p>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l"></span>
          <div class="progress-bar-wrapper"></div>
          <span class="time time-r"></span>
        </div>
        <div class="control-wrapper">
          <div class="control">
            <div class="icon">
              <span class="iconfont icon-cycle-icon"></span>
            </div>
            <div class="icon">
              <span class="iconfont icon-previous-icon"></span>
            </div>
            <div class="icon">
              <span class="iconfont icon-player-paly-icon play-icon"></span>
            </div>
            <div class="icon">
              <span class="iconfont icon-next-icon"></span>
            </div>
            <div class="icon">
              <span class="iconfont icon-dislike"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mini-player" v-show="!fullScreen" @click="open"></div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'player',
  methods: {
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    })
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong'
    ])
  },
  mounted () {
    console.log(this.currentSong)
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
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
        .mask
          position absolute
          top 0
          left 0
          width 120%
          height 120%
          background rgba(0, 0, 0, .3)
          z-index 0
      .top
        display flex
        width 100%
        height 1rem
        .under-arrow
          position relative
          z-index 100
          display block
          font-size $font-size-xs
          color #fff
          line-height 1rem
          margin-left .24rem
        .top-title
          flex 1
          line-height 1rem
          font-size $font-size-xl
          color #fff
          text-align center
          transform translateX(-.32rem)
      .singer
        text-align center
        font-size $font-size-s
        margin-top -.16rem
        color rgba(255, 255, 255, .6)
      .album-wrapper
        position relative
        width 6rem
        height 6rem
        margin .56rem auto 0 auto
        background url("./album-wrapper.png")
        background-size contain
        .img-wrapper
          width 100%
          height 100%
          position absolute
          z-index -1
          overflow hidden
          .cd-img-wrapper
            width 64%
            height 64%
            background: #ddd
            border-radius 50%
            margin 0 auto
            transform translateY(29%)
            .cd-img
              display block
              width 100%
      .bottom
        .lyric
          margin-top 1rem
          width 100%
          .lyric-desc
            text-align center
            font-size $font-size-m
            color #fff
        .control-wrapper
          position absolute
          bottom 1.5rem
          width 100%
          .control
            display flex
            height 1rem
            .icon
              flex 1
              span
                font-size $font-size-xl
                display block
                text-align center
                line-height 1rem
                color #141a29
                &.play-icon
                  font-size .6rem
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
