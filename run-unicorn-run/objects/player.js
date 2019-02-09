import { GameImage, GameSprite, GameObject } from '../core/game/index.js'
import * as draw from '../core/draw.js'
import physics from '../core/physics.js'
import state from '../core/state.js'
import * as utils from '../core/utils.js'

// ----------------------------------------
// Player
// ----------------------------------------
const boundingBoxL = {
  boundingBoxTop: 5,
  boundingBoxLeft: 8,
  boundingBoxWidth: 28,
  boundingBoxHeight: 41,
}
const boundingBoxR = {
  boundingBoxTop: 5,
  boundingBoxLeft: 11,
  boundingBoxWidth: 28,
  boundingBoxHeight: 41,
}
export const imgPlayerR = new GameImage('../images/my-littlepony-right.png')
export const imgPlayerL = new GameImage('../images/my-littlepony-left.png')
export const sprPlayerIdleR = new GameSprite({
  image: imgPlayerR,
  frameCount: 16,
  frameWidth: 45,
  frameHeight: 46,
  offsetX: 0,
  offsetY: 543,
  scaleX: 2,
  scaleY: 2,
  insertionX: 24,
  insertionY: 46,
  stepsPerFrame: 8,
  ...boundingBoxR,
})
export const sprPlayerIdleL = new GameSprite({
  image: imgPlayerL,
  rtl: true,
  frameCount: 16,
  frameWidth: 45,
  frameHeight: 46,
  offsetX: 1106,
  offsetY: 543,
  scaleX: 2,
  scaleY: 2,
  insertionX: 24,
  insertionY: 46,
  stepsPerFrame: 8,
  ...boundingBoxL,
})
export const sprPlayerWalkR = new GameSprite({
  image: imgPlayerR,
  frameCount: 6,
  frameWidth: 48,
  frameHeight: 46,
  offsetX: 55,
  offsetY: 12,
  scaleX: 2,
  scaleY: 2,
  insertionX: 24,
  insertionY: 46,
  stepsPerFrame: 2,
  ...boundingBoxR,
})
export const sprPlayerWalkL = new GameSprite({
  image: imgPlayerL,
  rtl: true,
  frameCount: 6,
  frameWidth: 48,
  frameHeight: 46,
  offsetX: 1051,
  offsetY: 12,
  scaleX: 2,
  scaleY: 2,
  insertionX: 24,
  insertionY: 46,
  stepsPerFrame: 2,
  ...boundingBoxL,
})

const objPlayer = new GameObject({
  sprite: sprPlayerIdleR,
  x: 100,
  y: 573,
  jump: 10,
  maxSpeed: 4,
  acceleration: 0.5,
  events: {
    step: {
      actions: [
        self => {
          if (state.mouse.down) {
            const speed = Math.pow(
              utils.distance(self.x, self.y, state.mouse.x, state.mouse.y) /
                300,
              2,
            )
            self.friction = 0
            self.motionAdd(
              utils.direction(self.x, self.y, state.mouse.x, state.mouse.y),
              Math.max(0, speed),
            )
          } else if (self.y >= state.room.height) {
            self.friction = physics.friction
          }
        },
      ],
    },

    draw: {
      actions: [
        self => {
          if (state.mouse.down) {
            draw.setLineWidth(2)
            draw.setColor('brown')
            draw.arrow(self.x, self.y, state.mouse.x, state.mouse.y)
          }
        },
      ],
    },

    keyDown: {
      ArrowUp: {
        actions: [
          self => {
            if (self.y + self.sprite.insertionY >= state.room.height) {
              self.motionAdd(physics.DIRECTION_UP, self.jump)
            }
          },
        ],
      },
      d: {
        actions: [self => (state.debug = !state.debug)],
      },
    },

    keyUp: {
      ArrowRight: {
        actions: [
          self => {
            self.setSprite(sprPlayerIdleR)
            self.friction = physics.friction
          },
        ],
      },
      ArrowLeft: {
        actions: [
          self => {
            self.setSprite(sprPlayerIdleL)
            self.friction = physics.friction
          },
        ],
      },
    },

    keyboard: {
      ArrowRight: {
        actions: [
          self => {
            self.setSprite(sprPlayerWalkR)
            self.friction = 0
            self.motionAdd(physics.DIRECTION_RIGHT, self.acceleration)
          },
        ],
      },
      ArrowLeft: {
        actions: [
          self => {
            self.setSprite(sprPlayerWalkL)
            self.friction = 0
            self.motionAdd(physics.DIRECTION_LEFT, self.acceleration)
          },
        ],
      },
    },
  },
})

export default objPlayer