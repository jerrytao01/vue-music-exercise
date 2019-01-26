<template>
  <div id="app">
    <music-header></music-header>
    <mtab></mtab>
    <router-view></router-view>
  </div>
</template>

<script>
import MusicHeader from './components/music-header/music-header'
import Mtab from './components/mtab/mtab'
export default {
  name: 'App',
  components: {
    Mtab,
    MusicHeader
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
