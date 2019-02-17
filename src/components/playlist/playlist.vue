<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h2 class="title">
            <span class="iconfont" :class="iconMode" @click="changeMode"></span>
            <span class="text">{{modeText}}
              (<span class="count">{{playList.length}}</span>)
            </span>
            <span class="clear" @click="showConfirm">
              <span class="iconfont icon-lajitong lajitong"></span>
            </span>
          </h2>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li class="item" ref="listItem"
                @click="selectItem(item, index)"
                v-for="(item, index) in sequenceList" :key="item.id">
              <span class="current iconfont icon-xiaolaba" :class="getCurrentIcon(item)"></span>
              <span class="text">{{item.name}}</span>
              <span class="delete" @click.stop="deleteOne(item)">
                <span class="iconfont icon-guanbi guanbi"></span>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
    </div>
  </transition>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
import Confirm from '../../base/confirm/confirm'
import Scroll from '../../base/scroll/scroll'
import {playMode} from '../../common/js/config'
import {shuffle} from '../../common/js/util'

export default {
  name: 'playlist',
  components: {Scroll, Confirm},
  data () {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },
  methods: {
    hide () {
      this.showFlag = false
    },
    show () {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    scrollToCurrent (current) {
      console.log('进来了')
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    confirmClear () {
      this.deleteSongList()
      this.hide()
      this.$emit('stopMusic')
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      console.log(this.mode)
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    getCurrentIcon (item) {
      if (this.currentSong.id === item.id) {
        return 'on'
      }
      return ''
    },
    deleteOne (item) {
      this.deleteSong(item)
      if (!this.playList.length) {
        this.hide()
        this.$emit('stopMusic')
      }
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        // 返回 index
        return item.id === this.currentSong.id
      })
      console.log('index', index)
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  computed: {
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    },
    iconMode () {
      if (this.mode === playMode.sequence) {
        return 'icon-cycle-icon'
      } else if (this.mode === playMode.loop) {
        return 'icon-single-cycle-icon'
      } else {
        return 'icon-random-icon'
      }
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
      // 'favoriteList'
    ])
  },
  watch: {
    currentSong (newVal, oldVal) {
      if (!this.showFlag || newVal.id === oldVal.id) {
        return
      }
      this.scrollToCurrent(newVal)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .playlist
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 200
    background-color rgba(0, 0, 0, 0.3)
    &.list-fade-enter-active, &.list-fade-leave-active
      transition opacity 0.3s
      .list-wrapper
        transition all 0.3s

    &.list-fade-enter, &.list-fade-leave-to
      opacity 0
      .list-wrapper
        transform translate3d(0, 100%, 0)

    .list-wrapper
      position absolute
      left 0
      bottom 0
      width 100%
      border-radius 8px
      background-color #fafafa
      .list-header
        position relative
        padding .4rem .6rem .2rem .4rem
        .title
          display flex
          align-items center
          .iconfont
            margin-right .2rem
            font-size .4rem
            color #999

          .text
            flex 1
            font-size $font-size-m
            color #666
            .count
              position relative
              top 1px

          .clear
            extend-click()
            right -14px
            .lajitong
              display block
              font-size $font-size-xl
              color #999

      .list-content
        max-height 4.8rem
        overflow hidden
        .item
          display flex
          align-items center
          height .8rem
          padding 0 .6rem 0 .4rem
          overflow hidden
          &.list-enter-active, &.list-leave-active
            transition all 0.1s

          &.list-enter, &.list-leave-to
            height 0

          .icon-xiaolaba
            color $color-theme
            display none
            &.on
              display block
              margin-right .1rem

          .text
            flex 1
            no-wrap()
            line-height .4rem
            font-size $font-size-m
            color #666

          .delete
            extend-click()
            font-size 5px
            color $color-theme
            .guanbi
              font-size 10px

      .list-close
        text-align center
        line-height 1rem
        background #f5f5f5
        font-size $font-size-ml
        color #333

</style>
