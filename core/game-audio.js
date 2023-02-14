export class GameAudio {
  /** @type boolean */
  loop

  /** @type number */
  volume

  constructor(src) {
    this.element = new Audio(src)

    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
  }

  /** @type boolean */
  get loop() {
    return this.element.loop
  }

  set loop(val) {
    this.element.loop = val
  }

  get volume() {
    return this.element.volume
  }

  set volume(val) {
    this.element.volume = val
  }

  play() {
    if (!this.element.paused) return

    this.element
      .cloneNode(true) // allow playing this sound multiple times at once
      .play()
      .catch((error) => {
        switch (error) {
          case 'NotAllowedError':
            console.error(`Can't play audio, try implementing a "play" button.`)
            break
          case 'NotSupportedError':
            console.error(`Can't play audio, unsupported media format.`)
            break
          default:
            console.error(`Unknown error playing audio: ${error}`)
            break
        }
      })
  }

  pause() {
    if (this.element.paused) return

    this.element.pause()
  }
}
