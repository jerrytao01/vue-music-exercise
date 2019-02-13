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
        <transition name="cd-fade">
          <div class="album-wrapper" v-show="toggleLyric">
            <div class="img-wrapper" :class="cdCls">
              <div class="cd-img-wrapper">
                <img class="cd-img" :src="currentSong.image" alt="">
              </div>
            </div>
          </div>
        </transition>
        <transition name="fade">
          <scroll ref="lyricList" v-if="!toggleLyric" :data="currentLyric && currentLyric.lines" class="scroll-lyric">
            <div class="lyric-wrapper" @click.stop="_showCd">
              <div class="currentLyric" v-if="currentLyric">
                <p ref="lyricLine" :class="{'current': currentLineNum === index}" class="text" v-for="(line, index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
              <p class="no-lyric" v-if="currentLyric === null"></p>
            </div>
          </scroll>
        </transition>

        <div class="bottom">
          <div class="lyric" v-show="toggleLyric"  @click.stop="_hiddenCd">
            <p class="lyric-desc">{{playingLyric}}</p>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChangeEnd="percentChangeEnd"
                            @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(duration)}}</span>
          </div>
          <div class="control-wrapper">
            <div class="control">
              <div class="icon" @click="changeMode">
                <span class="iconfont" :class="iconMode"></span>
              </div>
              <div class="icon" :class="disableCls">
                <span @click="prev" class="iconfont icon-previous-icon"></span>
              </div>
              <div class="icon" :class="disableCls">
                <span @click="togglePlaying" class="iconfont play-icon" :class="playIcon"></span>
              </div>
              <div class="icon" :class="disableCls">
                <span @click="next" class="iconfont icon-next-icon"></span>
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
    <audio @canplay="ready" @error="error" ref="audio" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {getSong, getLyric} from '../../api/song'
import {ERR_OK} from '../../api/config'
import ProgressBar from '../../base/progress-bar/progress-bar'
import {playMode} from '../../common/js/config'
import {shuffle} from '../../common/js/util'
import Lyric from 'lyric-parser'
import Scroll from '../../base/scroll/scroll'

export default {
  name: 'player',
  components: {Scroll, ProgressBar},
  data () {
    return {
      url: '',
      songReady: false,
      currentLyric: null,
      currentLineNum: 0,
      currentTime: 0,
      duration: 0,
      percent: 0,
      noLyric: false,
      toggleLyric: true,
      playingLyric: ''
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
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    format (interval) { // 转换时间
      interval = interval | 0
      let minute = interval / 60 | 0
      let second = interval % 60
      if (second < 10) {
        second = '0' + second
      }
      return minute + ':' + second
    },
    percentChange (percent) {
      this.move = true
      const currentTime = this.duration * percent
      this.currentTime = currentTime
      this.$refs.audio.currentTime = currentTime
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
      if (!this.playing) {
        this.$refs.audio.play()
        this.setPlayingState(true)
      }
    },
    percentChangeEnd (percent) {
      this.move = false
      const currentTime = this.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
      if (!this.playing) {
        this.$refs.audio.play()
        this.setPlayingState(true)
      }
    },
    changeMode () { // 改变播放模式
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    _resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    end () { // audio播放完成派发的事件
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek()
      }
    },
    prev () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    next () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
    },
    _getSong (id) {
      getSong(id).then((res) => {
        if (res.status === ERR_OK) {
          this.url = res.data.data[0].url
        }
      })
    },
    _getLyric (id) {
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLyric = null
      }
      this.noLyric = false
      getLyric(id).then((res) => {
        this.currentLyric = new Lyric(res.data.lrc.lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
          // this.currentLineNum = 0
          // this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
      }).catch(() => {
        this.currentLyric = null
        this.noLyric = true
        this.currentLineNum = 0
      })
    },
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      this.playingLyric = txt
      if (!this.$refs.lyricList) {
        return
      }
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 4]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        if (!this.$refs.lyricList) {
          return
        }
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    _hiddenCd () {
      this.toggleLyric = false
    },
    _showCd () {
      this.toggleLyric = true
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  },
  computed: {
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon () {
      return this.playing ? 'icon-CombinedShape' : 'icon-player-paly-icon'
    },
    miniIcon () {
      return this.playing ? 'icon-pause' : 'icon-Triangle'
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-cycle-icon' : this.mode === playMode.loop ? 'icon-single-cycle-icon' : 'icon-random-icon'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
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
      this._getLyric(this.currentSong.id)
      this.$refs.audio.src = newUrl
      this.setPlayingState(true)
      this.$refs.audio.play()
      let stop = setInterval(() => {
        this.duration = this.$refs.audio.duration
        if (this.duration) {
          clearInterval(stop)
        }
      }, 150)
    },
    currentTime () {
      this.percent = this.currentTime / this.duration
    }
  },
  created () {
    this.move = false
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
          overflow hidden

      .singer
        text-align center
        font-size $font-size-s
        margin-top -.16rem
        color rgba(255, 255, 255, .6)

      .scroll-lyric
        display inline-block
        position absolute
        bottom 4rem
        top 1.4rem
        vertical-align top
        width 100%
        overflow hidden

        .lyric-wrapper
          width 80%
          margin 0 auto
          overflow hidden
          text-align center
          .text
            line-height .8rem
            color rgba(255, 255, 255, .4)
            font-size $font-size-m
            &.current
              color #fff

          .no-lyric
            line-height 40px
            margin-top 60%
            color rgba(255, 255, 255, .4)
            font-size $font-size-m

      .album-wrapper
        position relative
        z-index 100
        width 6rem
        height 6rem
        margin .56rem auto 0 auto
        background url("./album-wrapper.png")
        background-size contain

        .img-wrapper
          width 100%
          height 100%
          position absolute
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
            overflow hidden

            .cd-img
              position absolute
              z-index -100
              display block
              width 100%

      .bottom
        position fixed
        width 100%
        bottom 140px

        .lyric
          margin-top 1rem
          width 100%

          .lyric-desc
            text-align center
            font-size $font-size-m
            color #fff

        .progress-wrapper
          display: flex
          align-items: center
          width: 86%
          margin: .6rem auto 0 auto
          padding: 10px 0

          .time
            color #fff
            font-size: $font-size-m
            flex: 0 0 30px
            line-height: 30px
            width: 30px

            &.time-l
              text-align: left
              margin-right 10px

            &.time-r
              text-align: right
              margin-left 10px

          .progress-bar-wrapper
            flex 1

        .control-wrapper
          position absolute
          /*bottom 1.5rem*/
          margin-top .3rem
          width 100%

          .control
            display flex
            height 1rem

            .icon
              flex 1

              &.disable
                opacity .5

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

      .cd-fade-enter, .cd-fade-leave-to
        opacity 0
      .cd-fade-enter-active, .cd-fade-leave-to
        transition all .2s

      .fade-enter, .fade-leave-to
        opacity 0
      .fade-enter-active, .fade-leave-to
        transition all .2s

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
