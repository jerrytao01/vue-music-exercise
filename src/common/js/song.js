export default class Song {
  constructor ({id, singer, name, album, image}) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.image = image
  }
}

function singerName (array) {
  let name = []
  name = array.map((item) => {
    return item.name
  })
  return name.join('/')
}

export function creatSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl
  })
}

export function createRecommendListSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl
  })
}
