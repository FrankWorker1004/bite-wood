import { gameDrawing } from './game-drawing-controller.js'
import { gameRooms } from './game-rooms.js'
import { gameMouse } from './game-mouse-controller.js'
import { gameState } from './game-state-controller.js'
import { gameKeyboard } from './game-keyboard-controller.js'
import { avg } from './math.js'
import { handleCollisions } from './collision.js'

// Tracks whether the game loop is running
let _isRunning = false

// Tracks the time of the last tick in the game loop
let _lastTickTimestamp = 0

// Tracks the requestAnimationFrame timer
let _raf = null

/**
 * Runs the game loop. Calls the step() and draw() methods on all objects.
 */
export class Game {
  /**
   * A list of the last 100 FPS values.
   * @private
   * @type {number[]}
   */
  #fps = []

  /**
   * @param {HTMLElement} [parentElement=document.body] - A DOM element where the canvas should be placed.
   * @param {number} [width=800] - The width of the game in pixels.
   * @param {number} [height=600] - The height of the game in pixels.
   */
  constructor(
    { parentElement = document.body, width = 800, height = 600 } = {
      parentElement: document.body,
      width: 800,
      height: 600,
    },
  ) {
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.tick = this.tick.bind(this)

    this.step = this.step.bind(this)
    this.draw = this.draw.bind(this)

    this.width = width
    this.height = height

    gameDrawing.setCanvasWidth(this.width)
    gameDrawing.setCanvasHeight(this.height)
    parentElement.append(gameDrawing.canvas)
  }

  start() {
    if (_isRunning) return

    _isRunning = true
    this.tick()
  }

  stop() {
    cancelAnimationFrame(_raf)
  }

  tick() {
    const timestamp = Date.now()
    const timeSinceTick = timestamp - _lastTickTimestamp

    // TODO: This is a hacky way of ensuring 120hz displays tick at 60 FPS
    //       A better way is to calc the number of frames that should be ticked.
    //       since the last time they were drawn.
    //       Example:
    //         frames = Math.round((timeNow - lastTickTime) / 16.667)
    //         for frames, tick()
    //         draw()
    if (timeSinceTick < 15) {
      _raf = requestAnimationFrame(this.tick)
      return
    }

    _lastTickTimestamp = timestamp

    // track FPS
    if (gameState.debug) {
      const fps = 1000 / timeSinceTick
      this.#fps.unshift(fps)
      this.#fps.splice(120) // 2 seconds worth of frames
    }

    // handle play/pause/debug global keybindings
    // if (gameKeyboard.down.P) {
    //   if (gameState.isPlaying) {
    //     gameState.pause()
    //   } else {
    //     gameState.play()
    //   }
    // }

    if (gameKeyboard.down['`']) {
      gameState.debug = !gameState.debug
    }

    this.step()
    this.draw()

    // TODO: seems the typing should have a tick as well
    //       the game loop shouldn't know what gameKeyboard needs to do
    // Key up/down and mouse up/down should only fire once per tick, clear their values
    gameKeyboard.down = {}
    gameKeyboard.up = {}
    gameMouse.down = {}
    gameMouse.up = {}

    _raf = requestAnimationFrame(this.tick)
  }

  step() {
    if (!gameState.isPlaying) return
    if (!gameRooms.currentRoom) return

    //
    // Collisions
    //
    handleCollisions(gameRooms.currentRoom.objects)

    //
    // Step - user code should "win", call step after collisions
    //
    gameRooms.currentRoom.objects.forEach((object) => {
      try {
        object.step?.(object)
      } catch (err) {
        console.error('Failed to step object:', err)
      }
    })
  }

  draw() {
    gameDrawing.clear()

    // room - continue drawing if the room fails
    if (gameRooms.currentRoom) {
      try {
        gameRooms.currentRoom.draw?.(gameDrawing)
      } catch (err) {
        console.error('Failed to draw room:', err)
      }

      // objects
      gameRooms.currentRoom.objects.forEach((object) => {
        // continue drawing if the room fails
        try {
          object.draw?.(gameDrawing)
        } catch (err) {
          console.error('Failed to draw object:', err)
        }

        if (gameState.debug) {
          gameDrawing.objectDebug(object)
        }
      })
    }

    // debug drawings
    if (gameState.debug) {
      gameDrawing.mouseDebug(this.width, this.height)
      gameDrawing.fpsDebug(this.width, avg(this.#fps))
    }

    // paused - overlay
    if (!gameState.isPlaying) {
      const x = gameRooms.currentRoom.width / 2 - 40
      const y = gameRooms.currentRoom.height / 2
      const text = `PAUSED`

      // backdrop
      gameDrawing.fill('rgba(16, 16, 16, 0.5)')

      // text
      gameDrawing.setFontFamily() // default
      gameDrawing.setFontSize(18)
      gameDrawing.setFillColor('#fff')
      gameDrawing.setStrokeColor('#000')
      gameDrawing.text(text, x, y)
    }
  }
}
