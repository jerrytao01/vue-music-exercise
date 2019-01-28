<template>
  <div class="recommend">
    <div class="banner-wrapper" v-if="bannerList.length">
      <div class="banner-wrapper-view">
        <banner>
          <div v-for="item in bannerList" :key="item.encodeId">
            <a href="javascript:;">
              <img :src="item.imageUrl" alt="图片加载失败">
            </a>
          </div>
        </banner>
      </div>
    </div>
    <h2 class="title-list">推荐歌单<span class="iconfont icon-back-icon back-icon"></span></h2>
    <div class="recommend-list-wrapper">
      <div class="list-content-wrapper" v-for="(items, index) in caculateDiscList" :key="index">
        <a v-for="item in items" class="item-wrapper" :key="item.id">
          <div class="img-wrapper">
            <img class="list-img" :src="item.picUrl" alt="">
            <div class="has-listen"><span class="iconfont icon-listen listen"></span>511.5万</div>
          </div>
          <p class="list-desc">{{item.name}}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {ERR_OK, url} from '../../api/config'
import Banner from '../../base/banner/banner'

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
    }
  },
  computed: {
    caculateDiscList () {
      let arr = []
      for (let i = 0; i < this.discList.length; i += 3) {
        arr.push(this.discList.slice(i, i + 3))
      }
      console.log(arr)
      return arr
    }
  },
  created () {
    this._getBannerList()
    this._getRecommendList()
  },
  components: {
    Banner
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .recommend
    position fixed
    width 100%
    top 1.76rem
    bottom 0
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
      .back-icon
        display inline-block
        font-size $font-size-s
        transform rotate(180deg)
    .recommend-list-wrapper
      padding-left .12rem
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
