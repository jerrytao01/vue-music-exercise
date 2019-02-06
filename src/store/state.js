import {playMode} from '../common/js/config'

const state = {
  singer: {}, // 歌手,
  playing: false, // 播放
  fullScreen: false, // 全屏
  playlist: [], // 播放列表
  sequenceList: [], // 随机播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1
}

export default state
