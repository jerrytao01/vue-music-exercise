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
    <h1>sdfsads</h1>
  </div>
</template>

<script>
import axios from 'axios'
import {ERR_OK, url} from '../../api/config'
import Banner from '../../base/banner/banner'

const bannerUrl = '/banner'

export default {
  name: 'recommend',
  data () {
    return {
      bannerList: []
    }
  },
  methods: {
    _getBannerList () {
      axios.get(url + bannerUrl).then((res) => {
        if (res.status === ERR_OK) {
          this.bannerList = res.data.banners.slice(0, 5)
        }
      })
    }
  },
  created () {
    this._getBannerList()
  },
  components: {
    Banner
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
</style>
