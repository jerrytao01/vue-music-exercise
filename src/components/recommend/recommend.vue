<template>
  <div class="recommend">
    <scroll class="wrapper" ref="scroll">
      <div> <!--这是的距离是需要滚动的内容-->
        <div class="banner-wrapper" v-if="bannerList.length">
          <div class="banner-wrapper-view">
            <banner>
              <div v-for="(item, index) in bannerList" :key="index"><!--修改key值，解决出现广告的bug-->
                <a href="javascript:;">
                  <img @load="loadImg" :src="item.imageUrl" alt="图片加载失败">
                </a>
              </div>
            </banner>
          </div>
        </div>
        <h2 class="title-list">推荐歌单<span class="iconfont icon-back-icon back-icon"></span></h2>
        <div class="recommend-list-wrapper" :data="discList">
          <div class="list-content-wrapper" v-for="(items, index) in caculateDiscList" :key="index">
            <a v-for="item in items" class="item-wrapper" :key="item.id">
              <div class="img-wrapper">
                <img class="list-img" v-lazy="item.picUrl" alt="">
                <div class="has-listen"><span class="iconfont icon-listen listen"></span>{{_caculateListen(item.playCount)}}
                </div>
              </div>
              <p class="list-desc">{{item.name}}</p>
            </a>
          </div>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import axios from 'axios'
import {ERR_OK, url} from '../../api/config'
import Banner from '../../base/banner/banner'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'

const bannerUrl = '/banner'
const recommendList = '/personalized'

export default {
  name: 'recommend',
  data () {
    return {
      bannerList: [],
      discList: []
    }
  },
  methods: {
    loadImg () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    _getBannerList () {
      axios.get(url + bannerUrl).then((res) => {
        if (res.status === ERR_OK) {
          this.bannerList = res.data.banners.slice(0, 5)
        }
      })
    },
    _getRecommendList () {
      axios.get(url + recommendList).then((res) => {
        if (res.status === ERR_OK) {
          this.discList = res.data.result
        }
      })
    },
    _caculateListen (count) {
      let result = null
      if (count > 9999) {
        result = (Math.floor(count / 1000)) / 10 + '万'
      } else if (count <= 9999 > count > 0) {
        result = (Math.floor(count / 100)) / 10 + 'k'
      } else {
        return
      }
      return result
    }
  },
  computed: {
    caculateDiscList () {
      let arr = []
      for (let i = 0; i < this.discList.length; i += 3) {
        arr.push(this.discList.slice(i, i + 3))
      }
      return arr
    }
  },
  created () {
    this._getBannerList()
    this._getRecommendList()
  },
  components: {
    Banner,
    Scroll,
    Loading
  }
}
</script>
<!--使用better-scroll的几个问题，首先必须要视口的高度小于滚动区域的高度，其次几个重要的css属性，详情见下文标注-->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .recommend
    position fixed
    width 100%
    top 1.76rem
    bottom 0 // 这里是关键，这样可以保证视口的高度在本屏幕内
    .wrapper
      overflow hidden // 这是为了给视口一个固定的位置
      height 100%
      .loading-container
        position absolute
        width 100%
        top 50%

      .banner-wrapper
        position relative
        z-index 10
        padding 0 .12rem

        .banner-wrapper-view
          width 100%
          height 100%
          border-radius .08rem
          overflow hidden

      .title-list
        height 1rem
        line-height 1rem
        padding-left .12rem
        font-weight 500
        font-size $font-size-m
        color #333
        background: #fff

        .back-icon
          display inline-block
          font-size $font-size-s
          transform rotate(180deg)

      .recommend-list-wrapper
        padding-left .12rem
        overflow hidden
        height 100%
        background: #fff

        .list-content-wrapper
          overflow hidden
          padding-bottom .12rem

          .item-wrapper
            float left
            box-sizing border-box
            display block
            width 33.33%
            padding-right .12rem
            padding-left 0

            .img-wrapper
              position relative
              padding-bottom 100%

              .list-img
                position absolute
                width 100%
                top 0
                left 0

              .has-listen
                position absolute
                right 4px
                top 4px
                font-size $font-size-xs
                color #fff

                .listen
                  margin-right 2px
                  font-size .24rem

            .list-desc
              display -webkit-box
              -webkit-box-orient vertical
              -webkit-line-clamp 2
              overflow hidden
              padding .12rem .04rem 0
              text-overflow ellipsis
              line-clamp: 2
              font-size $font-size-xs
              line-height .32rem
              color #4d4d4d
</style>
