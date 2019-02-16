<template>
  <transition name="slide">
    <div class="search" ref="searchWrapper">
      <div class="search-box-wrapper">
        <span @click="back" class="iconfont icon-back-icon back-icon"></span>
        <search-box ref="searchBox" @query="onQueryChange"></search-box>
      </div>
      <scroll ref="scroll" class="search-scroll-wrapper">
        <div ref="search">
          <div class="search-hots" v-show="!query">
            <p class="title">热门搜索</p>
            <span class="search-hots-item" v-for="item in hots" :key="item.id" @click="addQuery(item.first)">{{item.first}}</span>
          </div>
          <div class="search-result">
            <suggest @refresh="refresh" :query="query" ref="suggest"></suggest>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import SearchBox from '../../base/search-box/search-box'
import {getSearchHot} from '../../api/search'
import Suggest from '../suggest/suggest'
import Scroll from '../../base/scroll/scroll'
import {playlistMixin} from '../../common/js/mixin'

export default {
  name: 'search',
  mixins: [playlistMixin],
  data () {
    return {
      hots: [],
      query: ''
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '1.4rem' : ''
      console.log(bottom)
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.searchWrapper.style.bottom = bottom
      this.refresh()
    },
    back () {
      this.$router.back()
      this.$refs.searchBox.clear()
    },
    onQueryChange (query) {
      this.query = query
    },
    addQuery (query) {
      console.log(query)
      this.$refs.searchBox.setQuery(query)
    },
    refresh () {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    },
    _getSearchHot () {
      getSearchHot().then((res) => {
        this.hots = res.data.result.hots
      })
    }
  },
  created () {
    this._getSearchHot()
  },
  components: {Scroll, Suggest, SearchBox}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .search
    position fixed
    z-index 150
    top 0
    right 0
    bottom 0
    left 0
    background #fafafa

    .search-box-wrapper
      background $color-linear-gradient
      padding .14rem .8rem .14rem .88rem

      .back-icon
        display block
        width .88rem
        height .9rem
        line-height .9rem
        position absolute
        left 0
        top 0
        font-size $font-size-l
        color #fff
        text-align center

    .search-scroll-wrapper
      position fixed
      top .88rem
      bottom 0
      /*height 100%*/
      width 100%
      overflow hidden
      font-size 0

      .search-hots
        margin 0 .4rem

        .title
          padding .1rem .1rem 0 .1rem
          height .6rem
          line-height .6rem
          font-size $font-size-s
          color #666

        .search-hots-item
          display inline-block
          padding .06rem .1rem
          margin .08rem .08rem
          border 1px solid #ccc
          border-radius .1rem
          line-height .4rem
          color #777
          font-size $font-size-m

      .shortcut-wrapper
        position relative
        margin 0 auto

        .shortcut
          height 100%
          overflow hidden

          .hot-key
            margin 0 .4rem .4rem .4rem

            .title
              margin-bottom .4rem
              font-size $font-size-m
              color #666

            .item
              display inline-block
              padding .1rem .2rem
              margin 0 .4rem .2rem 0
              border-radius .12rem
              background #ccc
              font-size $font-size-m
              color #999

        .search-history
          position relative
          margin .2rem .5rem

          .title
            display flex
            align-items center
            height .6rem
            font-size $font-size-m
            color #666

            .text
              flex 1

            .clear
              .icon-clear
                font-size $font-size-m
                color #666

      .search-result
        position relative
        width 100%
        top .2rem
        bottom 0

  .router-view
    z-index: 1000

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform translate3d(50%, 0, 0)
    opacity 0
</style>
