<template>
  <div class="suggest"></div>
</template>

<script>
export default {
  name: 'suggest'
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
          color #666
          no-wrap()

        .singer
          font-size $font-size-s
          color #666
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

  .no-result-wrapper
    position fixed
    overflow hidden
    left 50%
    top 40vh
    transform translatex(-50%)
    color $color-text
</style>
