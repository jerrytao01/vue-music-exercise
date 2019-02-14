<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="scroll">
      <ul>
        <li class="item" v-for="item in topList" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.coverImgUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.top" :key="index">
              <span>{{index + 1}}.</span>
              <span>{{song.name}} - {{song.ar[0].name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div v-show="showLoading" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {getTop} from '../../api/rank'
import Loading from '../../base/loading/loading'
import Scroll from '../../base/scroll/scroll'
import {playlistMixin} from '../../common/js/mixin'
import {mapMutations} from 'vuex'

const TOP_LIST_ARR = [0, 1, 2, 3, 4, 5, 6]

export default {
  name: 'rank',
  mixins: [playlistMixin],
  components: {Scroll, Loading},
  data () {
    return {
      topList: [],
      showLoading: true
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '1.4rem' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem (item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    _getTopList () {
      for (let i = 0; i < TOP_LIST_ARR.length; i++) {
        getTop(TOP_LIST_ARR[i]).then((res) => {
          let list = res.data.playlist
          list.top = res.data.playlist.tracks.slice(0, 3)
          this.topList.push(list)
        })
        if (i === TOP_LIST_ARR.length - 1) {
          this.showLoading = false
        }
      }
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  created () {
    this._getTopList()
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .rank
    position fixed
    top 1.76rem
    width 100%
    bottom 0
    .toplist
      height 100%
      overflow hidden
      .item
        display flex
        margin 0 .4rem
        padding .2rem 0 .2rem
        height 2rem
        border-1px(#eee)
        &:last-child
          padding-bottom .4rem
        .icon
          flex 0 0 2rem
          width 2rem
          height 2rem
        .songlist
          flex 1
          display flex
          flex-direction column
          justify-content center
          padding 0 .4rem
          height 2rem
          overflow hidden
          background #fafafa
          color $font-color-m
          font-size $font-size-sm
          .song
            no-wrap()
            line-height .52rem
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
