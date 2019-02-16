<template>
  <div class="search-box">
    <input class="box" :placeholder="placeholder" v-model="query" type="text">
    <i v-show="query" class="iconfont icon-close-icon close-icon" @click="clear"></i>
  </div>
</template>

<script>
import {debounce} from '../../common/js/util'

export default {
  name: 'search-box',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: '',
      clickInfo: '搜索'
    }
  },
  created () {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 300))
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"

  .search-box
    display flex
    align-items center
    box-sizing border-box
    width 100%
    height .6rem
    .icon-search
      font-size .48rem
      color $font-color-m

    .box
      flex 1
      line-height .6rem
      background #fff
      color #333
      font-size $font-size-m
      padding-left .2rem
      border none
      outline none
      border-radius .04rem
      &::placeholder
        color rgba(255, 255, 255, 0.6)

    .icon-delete
      position absolute
      right 12px
      font-size 14px
      color rgba(255, 255, 255, 0.8)
      border none

    .search
      padding 0 5px
      font-size 14px
      color #666

    .close-icon
      position absolute
      right .24rem
      color #fff
      font-size $font-size-l

</style>
