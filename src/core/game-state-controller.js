import { gameRooms } from './game-rooms.js'

class GameState {
  constructor() {
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
  }

  /**
   * Turns on helpful information for debugging.
   * @type {boolean}
   */
  debug = false

  #isPlaying = true

  /**
   * Indicates whether the game is currently playing. Change with state.play() and state.pause().
   * @see {play}
   * @see {pause}
   * @type {boolean}
   */
  get isPlaying() {
    return this.#isPlaying
  }

  /** Play or resume the game. */
  play() {
    this.#isPlaying = true

    // TODO: controlling room music should be user code, not framework
    gameRooms.currentRoom?.backgroundMusic?.playOne()
  }

  /** Pause gameplay. */
  pause() {
    this.#isPlaying = false

    // TODO: controlling room music should be user code, not framework
    gameRooms.currentRoom?.backgroundMusic?.pause()
  }
}

export const gameState = new GameState()
window.biteWood = window.biteWood || {}
window.biteWood.gameState = gameState
