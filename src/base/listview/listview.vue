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
            <li @click="selectItme(item)" class="listview-item" v-for="item in group.items" :key="item.id">
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
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
  </scroll>
</template>

<script>
import Scroll from '../scroll/scroll'
import {getData} from '../../common/js/dom'

const ITEM_HEIGHT = 18
const TITLE_HEIGHT = 30

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
      currentIndex: 0,
      diff: -1 // 滚动的偏差
    }
  },
  methods: {
    selectItme (item) {
      this.$emit('select', item)
    },
    onTouchSlideStart (e) { // 监听移动开始事件
      let slideIndex = parseInt(getData(e.target, 'index'))
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY // 保存第一次触摸的时候Y值
      this.touch.firstIndex = slideIndex
      this._scrollTo(slideIndex)
    },
    onTouchSlideMove (e) { // 监听移动事件
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let difference = (this.touch.y2 - this.touch.y1) / ITEM_HEIGHT | 0
      let finialIndex = this.touch.firstIndex + difference
      this._scrollTo(finialIndex)
    },
    onScrollEvent (pos) {
      this.scrollY = pos.y
    },
    refresh () {
      this.$refs.listView.refresh()
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.$refs.listView.scrollToElement(this.$refs.listViewGroup[index])
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
      // 滚动到顶部, newY大于0，就让currentindex一直停留第一个
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 滚动到中部地区
      for (let i = 0; i < listHeight.length - 1; i++) {
        let heightMin = listHeight[i] // 下限
        let heightMax = listHeight[i + 1] // 上限
        // newY是负值
        if (-newY >= heightMin && -newY < heightMax) {
          this.currentIndex = i
          this.diff = heightMax + newY
          return
        }
      }
      // 滚动到底部地区
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  computed: {
    slideList () {
      return this.list.map((group) => {
        return group.title.substring(0, 1)
      })
    },
    fixedTitle () {
      if (!this.list) {
        return
      }
      if (this.scrollY > 0) {
        return ''
      }
      return this.list[this.currentIndex] ? this.list[this.currentIndex].title : ''
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
    .list-fixed
      position absolute
      top 0
      width 100%
      height .6rem
      line-height .6rem
      background #f0f0f0
      font-size $font-size-s
      color $font-color-m
      .fixed-title
        margin-left .3rem
</style>
