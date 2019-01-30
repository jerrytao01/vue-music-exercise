<template>
  <scroll :data="list"
          :probe-type="probeType"
          class="listview"
          :listen-scroll="listenScroll"
          @scroll="onScrollEvent"
          ref="listView">
    <ul>
      <li class="listview-group" v-for="(group, index) in list" :key="index" ref="listViewGroup">
        <h2 class="title">{{group.title}}</h2>
          <ul>
            <li class="listview-item" v-for="item in group.items" :key="item.id">
              <img class="avatar" v-lazy="item.avatar" alt="">
              <p class="singer-name">{{item.name}}</p>
            </li>
          </ul>
      </li>
    </ul>
    <div
      class="slide-list"
      v-if="list"
      @touchstart="onTouchSlideStart"
      @touchmove.stop.prevent="onTouchSlideMove">
      <ul>
        <li :class="{'active': currentIndex === index}" :data-index="index" class="slide-item" v-for="(item, index) in slideList" :key="index">{{item}}</li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from '../scroll/scroll'
import {getData} from '../../common/js/dom'

const ITEM_HEIGHT = 18

export default {
  name: 'listview',
  components: {Scroll},
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0
    }
  },
  methods: {
    onTouchSlideStart (e) { // 监听移动开始事件
      let slideIndex = parseInt(getData(e.target, 'index'))
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY // 保存第一次触摸的时候Y值
      this.touch.firstIndex = slideIndex
      this.$refs.listView.scrollToElement(this.$refs.listViewGroup[slideIndex])
    },
    onTouchSlideMove (e) { // 监听移动事件
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let difference = (this.touch.y2 - this.touch.y1) / ITEM_HEIGHT | 0
      let finialIndex = this.touch.firstIndex + difference
      this.$refs.listView.scrollToElement(this.$refs.listViewGroup[finialIndex])
    },
    onScrollEvent (pos) {
      this.scrollY = pos.y
    },
    _caculateHeight () { // 计算高度
      this.listHeight = []
      const list = this.$refs.listViewGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    list () {
      setTimeout(() => {
        this._caculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (!height2 || (-newY > height1 && -newY < height2)) {
          this.currentIndex = i
          console.log(this.currentIndex)
          return
        }
      }
      this.currentIndex = 0
    }
  },
  computed: {
    slideList () {
      return this.list.map((group) => {
        return group.title.substring(0, 1)
      })
    }
  },
  created () {
    this.probeType = 3
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .listview
    position fixed
    width 100%
    top 1.76rem
    bottom 0
    overflow hidden
    .listview-group
      .title
        height .6rem
        line-height .6rem
        background #F0F0F0
        padding-left .3rem
        font-size $font-size-s
        color #666
      .listview-item
        display flex
        align-items center
        height 1.2rem
        background #fafafa
        .avatar
          width .96rem
          height .96rem
          border-radius 50%
          margin-left .3rem
        .singer-name
          font-size $font-size-m
          color $font-color-d
          margin-left .3rem
    .slide-list
      position fixed
      right: 0
      top: 50%
      transform translateY(-40%)
      z-index 10
      width .4rem
      padding .4rem 0
      border-radius .2rem
      text-align center
      background: #eeeff5
      .slide-item
        padding .06rem
        line-height 1
        font-size $font-size-xs
        color $font-color-l
        &.active
          color $color-theme
</style>
