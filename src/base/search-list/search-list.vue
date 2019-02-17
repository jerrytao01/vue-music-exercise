<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" @click="selectItem(item)" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="iconfont icon-guanbi close-icon"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'search-list',
  props: {
    searches: {
      type: Array
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    deleteOne (item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .search-list
    .search-item
      display: flex
      align-items: center
      height .7rem
      overflow hidden
      font-size $font-size-m
      &.list-enter-active, &.list-leave-active
        transition all 0.1s

      &.list-enter, &.list-leave-to
        height 0

      .text
        flex 1
        color #666

      .icon
        extend-click()
        .close-icon
          font-size $font-size-xs
          color #aaa
</style>
