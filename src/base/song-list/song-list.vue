<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song, index) in songs" :key="song.id">
        <div class="rank">{{index + 1}}</div>
        <div class="content">
          <div class="content-wrapper">
            <h3 class="name">{{song.name}}</h3>
            <p class="desc">{{song.album}}</p>
          </div>
        </div>
        <div class="play-icon">
          <span class="iconfont icon-Triangle play"></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {
    songs () {
      console.log(this.songs)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .song-list
    .item
      display flex
      align-items center
      height 1.1rem
      .rank
        width .8rem
        height 100%
        line-height 1.1rem
        color $font-color-m
        font-size $font-size-xl
        text-align center
      .content
        flex 1
        height 100%
        border-1px(#eee)
        .content-wrapper
          display flex
          flex-direction column
          height 100%
          .name
            flex 1
            margin-top .2rem
            font-size $font-size-l
            color $font-color-d
          .desc
            flex 1
            font-size $font-size-sm
            color $font-color-l
      .play-icon
        width 1rem
        height 100%
        line-height 1.1rem
        border-1px(#eee)
        .play
          display block
          text-align center
          font-size .44rem
          color $font-color-l
</style>
