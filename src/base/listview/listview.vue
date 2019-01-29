<template>
  <scroll :data="list" class="listview">
    <ul>
      <li class="listview-group" v-for="(group, index) in list" :key="index">
        <h2 class="title">{{group.title}}</h2>
          <ul>
            <li class="listview-item" v-for="item in group.items" :key="item.id">
              <img class="avatar" :src="item.avatar" alt="">
              <p class="singer-name">{{item.name}}</p>
            </li>
          </ul>
      </li>
    </ul>
  </scroll>
</template>

<script>
import Scroll from '../scroll/scroll'

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
</style>
