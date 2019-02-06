<template>
  <div id="app">
    <music-header></music-header>
    <mtab></mtab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MusicHeader from './components/music-header/music-header'
import Mtab from './components/mtab/mtab'
import Player from './components/player/player'

export default {
  name: 'App',
  components: {
    Player,
    Mtab,
    MusicHeader
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
