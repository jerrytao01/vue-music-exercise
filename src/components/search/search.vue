<template>
  <transition name="slide">
    <div class="search" ref="searchWrapper">
      <div class="search-box-wrapper">
        <span @click="back" class="iconfont icon-back-icon back-icon"></span>
        <search-box ref="searchBox" @query="onQueryChange"></search-box>
      </div>
      <scroll ref="scroll" class="search-scroll-wrapper" :pullup="pullup" @scrollToEnd="searchMore">
        <div ref="search">
          <div class="search-hots" v-show="!query">
            <p class="title">热门搜索</p>
            <span class="search-hots-item" v-for="item in hots" :key="item.id" @click="addQuery(item.first)">{{item.first}}</span>
          </div>
          <div class="shortcut-wrapper" v-show="!query">
            <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="showConfirm">
                  <span class="iconfont icon-lajitong"></span>
                </span>
              </h1>
              <search-list @select=addQuery @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
            </div>
          </div>
          <div class="search-result">
            <suggest @select="saveSearch" @refresh="refresh" :query="query" ref="suggest"></suggest>
          </div>
        </div>
      </scroll>
      <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空历史记录?" confirmBtnText="清空"></confirm>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import SearchBox from '../../base/search-box/search-box'
import {getSearchHot} from '../../api/search'
import Suggest from '../suggest/suggest'
import Scroll from '../../base/scroll/scroll'
import {playlistMixin} from '../../common/js/mixin'
import {mapActions, mapGetters} from 'vuex'
import SearchList from '../../base/search-list/search-list'
import Confirm from '../../base/confirm/confirm'

export default {
  name: 'search',
  mixins: [playlistMixin],
  data () {
    return {
      hots: [],
      query: '',
      pullup: true
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '1.4rem' : ''
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
      this.$refs.searchBox.setQuery(query)
    },
    refresh () {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    },
    searchMore () {
      this.$refs.suggest.searchMore()
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    _getSearchHot () {
      getSearchHot().then((res) => {
        this.hots = res.data.result.hots
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  created () {
    this._getSearchHot()
  },
  components: {Confirm, SearchList, Scroll, Suggest, SearchBox}
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
      width 100%
      overflow hidden
      font-size 0

      .search-hots
        margin 0 .4rem

        .title
          padding .1rem .1rem 0 .1rem
          height .6rem
          line-height .6rem
          font-size $font-size-ml
          color #666

        .search-hots-item
          display inline-block
          padding .06rem .1rem
          margin .08rem .08rem
          border 1px solid #ccc
          border-radius .1rem
          line-height .4rem
          color #777
          font-size $font-size-sm

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
            font-size $font-size-ml
            color #666

            .text
              flex 1

            .clear
              .icon-lajitong
                font-size $font-size-l
                color #999

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
