<template>
  <scroll :data="list" class="listview" ref="listView">
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
    <div class="slide-list" v-if="list" @touchstart="onTouchSlideStart">
      <ul>
        <li :data-index="index" class="slide-item" v-for="(item, index) in slideList" :key="index">{{item}}</li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from '../scroll/scroll'
import {getData} from '../../common/js/dom'

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
  methods: {
    onTouchSlideStart (e) {
      let slideIndex = getData(e.target, 'index')
      this.$refs.listView.scrollToElement(this.$refs.listViewGroup[slideIndex])
    }
  },
  computed: {
    slideList () {
      return this.list.map((group) => {
        return group.title.substring(0, 1)
      })
    }
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
