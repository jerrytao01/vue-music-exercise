<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <div class="mask"></div>
        <img width="100%" height="100%" :src="currentSong.image">
      </div>
      <div class="top">
        <span class="iconfont icon-double-underarrow under-arrow" @click="back"></span>
        <h2 class="top-title">{{currentSong.name}}</h2>
      </div>
      <p class="singer">{{currentSong.singer}}</p>
      <div class="album-wrapper">
        <div class="img-wrapper" :class="cdCls">
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
              <span @click="togglePlaying" class="iconfont play-icon" :class="playIcon"></span>
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
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="img-wrapper">
          <img :src="currentSong.image" :class="cdCls">
        </div>
        <div class="song-info">
          <h3 class="song-name">{{currentSong.name}}</h3>
          <p class="singer">{{currentSong.singer}}</p>
        </div>
        <div class="play-button">
          <span class="iconfont" :class="miniIcon" @click.stop="togglePlaying"></span>
        </div>
        <div class="play-list">
          <span class="iconfont icon-more"></span>
        </div>
      </div>
    </transition>
    <audio ref="audio"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {getSong} from '../../api/song'
import {ERR_OK} from '../../api/config'

export default {
  name: 'player',
  data () {
    return {
      url: ''
    }
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    togglePlaying () { // 切换播放状态
      const audio = this.$refs.audio
      this.setPlayingState(!this.playing)
      this.playing ? audio.play() : audio.pause()
    },
    _getSong (id) {
      getSong(id).then((res) => {
        if (res.status === ERR_OK) {
          this.url = res.data.data[0].url
        }
      })
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE'
    })
  },
  computed: {
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon () {
      return this.playing ? 'icon-CombinedShape' : 'icon-player-paly-icon'
    },
    miniIcon () {
      return this.playing ? 'icon-pause' : 'icon-Triangle'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing'
    ])
  },
  watch: {
    currentSong (newVal, oldVal) {
      if (!newVal.id) {
        return
      }
      if (newVal.id === oldVal.id) {
        return
      }
      this.$refs.audio.pause()
      this.$refs.audio.currentTime = 0
      this._getSong(newVal.id)
    },
    url (newUrl) {
      this.$refs.audio.src = newUrl
      this.setPlayingState(true)
      this.$refs.audio.play()
    }
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
          font-size $font-size-m
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
          &.play
            animation rotate 20s linear infinite
          &.pause
            animation-play-state paused
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
        height 100%
        .lyric
          margin-top 1rem
          width 100%
          .lyric-desc
            text-align center
            font-size $font-size-m
            color #fff
        .control-wrapper
          position absolute
          /*bottom 1.5rem*/
          margin-top 1.5rem
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
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)

    .mini-player
      display flex
      align-items center
      position fixed
      left 0
      bottom 0
      z-index 160
      width 100%
      height 1.2rem
      background #fafafa
      box-shadow 0 -4px 14px rgba(112, 115, 123, .1)
      .img-wrapper
        position absolute
        left .24rem
        top -.2rem
        width 1.2rem
        height 1.2rem
        border-radius 50%
        background: #000
        overflow hidden
        box-shadow 0 4px 8px rgba(112, 115, 123, .2)
        img
          display block
          width 1.2rem
          height 1.2rem
          &.play
            animation rotate 20s linear infinite
          &.pause
            animation-play-state paused
      .song-info
        flex 1
        padding-left 1.8rem
        height 1.2rem
        .song-name
          padding-top .2rem
          font-size $font-size-ml
          color $font-color-m
        .singer
          padding-top .1rem
          font-size $font-size-s
          color #b3b3b3
      .play-button
        width 60px
        height 100%
        text-align center
        span
          display block
          height 100%
          line-height 1.2rem
          color $color-theme
          font-size .6rem
      .play-list
        width 60px
        height 100%
        text-align center
        span
          display block
          height 100%
          line-height 1.2rem
          color $color-theme
          font-size .4rem
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
