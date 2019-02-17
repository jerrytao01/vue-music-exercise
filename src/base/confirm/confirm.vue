<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop="hide">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'confirm',
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    show () {
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
    },
    cancel () {
      this.hide()
      this.$emit('cancel')
    },
    confirm () {
      this.hide()
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .confirm
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index: 500
    background-color rgba(0, 0, 0, 0.5)
    &.confirm-fade-enter-active
      animation confirm-fadein 0.3s
      .confirm-content
        animation confirm-zoom 0.3s

    .confirm-wrapper
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      z-index 999
      .confirm-content
        width 5.4rem
        border-radius .1rem
        background #fafafa
        .text
          padding .24rem .3rem
          line-height 22px
          text-align center
          font-size $font-size-m
          color #333

        .operate
          display flex
          align-items center
          text-align center
          font-size $font-size-m
          .operate-btn
            flex 1
            line-height .44rem
            padding .24rem 0
            border-top 1px solid #ccc
            color $color-theme
            &.left
              color #666
              border-right 1px solid #ccc

  @keyframes confirm-fadein
    0%
      opacity: 0

    100%
      opacity: 1

  @keyframes confirm-zoom
    0%
      transform: scale(0)

    50%
      transform: scale(1.1)

    100%
      transform: scale(1)

</style>
