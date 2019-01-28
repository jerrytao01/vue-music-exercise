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
      <div class="list-content-wrapper">
        <a class="item-wrapper" href="">
          <div class="img-wrapper">
            <img class="list-img" src="http://p1.music.126.net/uRCu8NgrQ8e2JlZ40QaZXA==/109951163821691576.webp?imageView&thumbnail=246x0&quality=75&tostatic=0&type=webp" alt="">
          </div>
          <p class="list-desc">小年了|| 这时候你回家了吗？</p>
        </a>
        <a class="item-wrapper" href="">
          <div class="img-wrapper">
            <img class="list-img" src="http://p1.music.126.net/uRCu8NgrQ8e2JlZ40QaZXA==/109951163821691576.webp?imageView&thumbnail=246x0&quality=75&tostatic=0&type=webp" alt="">
          </div>
          <p class="list-desc">小年了|| 这时候你回家了吗？</p>
        </a>
        <a class="item-wrapper" href="">
          <div class="img-wrapper">
            <img class="list-img" src="http://p1.music.126.net/uRCu8NgrQ8e2JlZ40QaZXA==/109951163821691576.webp?imageView&thumbnail=246x0&quality=75&tostatic=0&type=webp" alt="">
          </div>
          <p class="list-desc">小年了|| 这时候你回家了吗？</p>
        </a>
      </div>
      <div class="list-content-wrapper">
        <a class="item-wrapper" href="">
          <div class="img-wrapper">
            <img class="list-img" src="http://p1.music.126.net/uRCu8NgrQ8e2JlZ40QaZXA==/109951163821691576.webp?imageView&thumbnail=246x0&quality=75&tostatic=0&type=webp" alt="">
          </div>
          <p class="list-desc">小年了|| 这时候你回家了吗？</p>
        </a>
        <a class="item-wrapper" href="">
          <div class="img-wrapper">
            <img class="list-img" src="http://p1.music.126.net/uRCu8NgrQ8e2JlZ40QaZXA==/109951163821691576.webp?imageView&thumbnail=246x0&quality=75&tostatic=0&type=webp" alt="">
          </div>
          <p class="list-desc">小年了|| 这时候你回家了吗？</p>
        </a>
        <a class="item-wrapper" href="">
          <div class="img-wrapper">
            <img class="list-img" src="http://p1.music.126.net/uRCu8NgrQ8e2JlZ40QaZXA==/109951163821691576.webp?imageView&thumbnail=246x0&quality=75&tostatic=0&type=webp" alt="">
          </div>
          <p class="list-desc">小年了|| 这时候你回家了吗？</p>
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
      padding 0 .12rem
      background: #eee
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
          &:last-child
            padding-right 0
          .img-wrapper
            position relative
            padding-bottom 100%
            .list-img
              position absolute
              width 100%
              top 0
              left 0
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
</style>
