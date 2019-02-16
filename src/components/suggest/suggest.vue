<template>
  <div class="suggest" v-show="query">
    <div class="search-suggest" v-show="!searchShow && query && songs.length>0">
      <p class="title" v-show="showSinger && showList">最佳匹配</p>
      <div @click="selectItem(suggest.artists[0])" v-if="suggest.artists && showSinger" class="search-suggest-item">
        <img :src="suggest.artists[0].img1v1Url" width="50" height="50">
        <span>歌手:{{suggest.artists[0].name}}</span>
      </div>
      <div @click="selectList(suggest.playlists[0])" class="search-suggest-item" v-if="suggest.playlists && showList">
        <img :src="suggest.playlists[0].coverImgUrl" width="50" height="50">
        <div class="text">
          <p>歌单：{{suggest.playlists[0].name}}</p>
          <p class="singer">{{suggest.albums[0].artist.name}}</p>
        </div>
      </div>
    </div>
    <ul class="suggest-list" ref="suggestList" v-show="!searchShow">
      <li @click="selectSong(item)" class="suggest-item" v-for="(item, index) in songs" :key="index">
        <div class="icon">
          <i></i>
        </div>
        <div class="name">
          <p class="song">{{item.name}}</p>
          <p class="singer">{{item.singer}}</p>
        </div>
      </li>
      <loading :title="null" v-show="haveMore && query"></loading>
    </ul>
    <div v-show="!haveMore && !songs.length && query" class="no-result-wrapper">
      抱歉，暂无搜索结果
    </div>
  </div>
</template>

<script>
import Loading from '../../base/loading/loading'
import Singer from '../../common/js/singer'
import {getSearchSongs, getSearchSuggest, getSongDetail} from '../../api/search'
import {createSearchSong} from '../../common/js/song'
import {mapActions, mapMutations} from 'vuex'

export default {
  name: 'suggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    showList: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      singer: {},
      songs: [],
      suggest: {},
      searchShow: true,
      page: 0,
      update: true,
      haveMore: true
    }
  },
  methods: {
    search () {
      this.searchShow = false
      this.haveMore = true
      getSearchSongs(this.query, this.page).then((res) => {
        if (!res.data.result.songs) {
          this.haveMore = false
          return
        }
        let list = res.data.result.songs
        let ret = []
        list.forEach((item) => {
          ret.push(createSearchSong(item))
        })
        this.songs = ret
        this.$emit('refresh')
      })
      this.page += 30
      getSearchSuggest(this.query).then((res) => {
        this.suggest = res.data.result
        console.log(this.suggest)
      })
    },
    selectItem (item) {
      const singer = new Singer({
        id: item.id,
        name: item.name,
        avatar: item.img1v1Url
      })
      this.$router.push({
        path: `/search/singer/${singer.id}`
      })
      this.setSinger(singer)
      this.$emit('select')
    },
    selectList (item) {
      console.log('item', item)
      const list = {}
      list.name = item.name
      list.id = item.id
      list.picUrl = item.coverImgUrl
      list.playCount = item.playCount
      this.$router.push({
        path: `/search/${list.id}`
      })
      this.setMusicList(list)
      this.$emit('select')
    },
    selectSong (item) {
      getSongDetail(item.id).then((res) => {
        item.image = res.data.songs[0].al.picUrl
        this.insertSong(item)
      })
      this.$emit('select')
    },
    searchMore () {
      if (!this.haveMore) {
        return
      }
      if (!this.songs.length) {
        return
      }
      getSearchSongs(this.query, this.page).then((res) => {
        let list = res.data.result.songs
        if (!res.data.result.songs) {
          this.haveMore = false
          return
        }
        let ret = []
        list.forEach((item) => {
          ret.push(createSearchSong(item))
        })
        this.songs = this.songs.concat(ret)
        this.$emit('refresh')
        this.page += 30
      })
    },
    ...mapMutations({
      setSinger: 'SET_SINGER',
      setMusicList: 'SET_DESC'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query (val) {
      if (val === '') {
        this.suggest = {}
        this.songs = []
        this.haveMore = false
        return
      }
      this.suggest = {}
      this.songs = []
      this.searchShow = true
      this.page = 0
      this.haveMore = true
      this.search()
    }
  },
  components: {Loading}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .suggest
    height 100%
    overflow hidden
    .search-go
      font-size $font-size-m
      margin-left .4rem
      color $color-theme

    .search-suggest
      .title
        padding-left .4rem
        padding-bottom .2rem
        color #666
        font-size .22rem

      .search-suggest-item
        display flex
        align-items center
        padding .16rem .4rem
        border-bottom 1px solid rgb(228, 228, 228)
        font-size $font-size-m
        img
          flex 0 0 50px
          padding-right 15px

        .text
          width 100%
          p
            width 5rem
            padding .06rem 0
            no-wrap()

          .singer
            font-size $font-size-s
            color #666

    .suggest-list
      padding-bottom .6rem
      .suggest-item
        display flex
        padding .06rem .4rem
        height 1rem
        align-items center
        border-bottom 1px solid rgb(228, 228, 228)
        p
          padding .06rem 0

        .song
          font-size $font-size-l
          color #333
          no-wrap()

        .singer
          font-size $font-size-s
          color #999
          no-wrap()

      .icon
        [class^="icon-"]
          font-size .28rem
          color #666

      .name
        flex 1
        font-size $font-size-m
        color #666
        overflow hidden
        no-wrap()

  .no-result-wrapper
    position fixed
    overflow hidden
    left 50%
    top 40vh
    transform translateX(-50%)
    color #666
    font-size $font-size-l
</style>
