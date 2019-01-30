<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script>
export default {
  name: 'singer-detail'
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .singer-detail
    position fixed
    z-index 10
    top 0
    right 0
    bottom 0
    left 0
    background: #666
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .slide-enter-active, .slide-leave-active
    transition all .3s ease-out
</style>
