import { gameRooms } from './game-rooms.js'

/**
 * Checks if a point is colliding with an object.
 * @param {number} x
 * @param {number} y
 * @param {GameObject} object
 * @returns {boolean}
 */
export const point = (x, y, object) => {
  return (
    x >= object.boundingBoxLeft &&
    x <= object.boundingBoxRight &&
    y >= object.boundingBoxTop &&
    y <= object.boundingBoxBottom
  )
}

/**
 * Checks if the top side of an object is colliding with some other object.
 * @param {GameObject} self
 * @param {GameObject} other
 * @returns {boolean}
 */
export const onTop = (self, other) => {
  return (
    self.boundingBoxTop <= other.boundingBoxBottom &&
    self.boundingBoxTop >= other.boundingBoxTop
  )
}
/**
 * Checks if the bottom side of an object is colliding with some other object.
 * @param {GameObject} self
 * @param {GameObject} other
 * @returns {boolean}
 */
export const onBottom = (self, other) => {
  return (
    self.boundingBoxBottom >= other.boundingBoxTop &&
    self.boundingBoxBottom <= other.boundingBoxBottom
  )
}
/**
 * Checks if the left side of an object is colliding with some other object.
 * @param {GameObject} self
 * @param {GameObject} other
 * @returns {boolean}
 */
export const onLeft = (self, other) => {
  return (
    self.boundingBoxLeft <= other.boundingBoxRight &&
    self.boundingBoxLeft >= other.boundingBoxLeft
  )
}
/**
 * Checks if the right side of an object is colliding with some other object.
 * @param {GameObject} self
 * @param {GameObject} other
 * @returns {boolean}
 */
export const onRight = (self, other) => {
  return (
    self.boundingBoxRight >= other.boundingBoxLeft &&
    self.boundingBoxRight <= other.boundingBoxRight
  )
}

/**
 * Checks if an object is colliding with some other object.
 * @param {GameObject} self
 * @param {'any'|'solid'|string} [other='any'] - If set to string, collisions only happen when the other object's name matches the string.
 * @param {Function} [cb] - A callback for custom logic in determining if a collision has occurred. It is called with two arguments: self, other.
 * @returns {boolean}
 */
export const objects = (self, other = 'any', cb) => {
  const withAny = other === 'any'
  const withSolid = other === 'solid'
  const name = !withAny && !withSolid ? other : ''

  return gameRooms.currentRoom.objects.some((object) => {
    // TODO: introduce object ids so as not to rely on instance equality, could be over network
    if (self === object) return false

    const isColliding =
      self.boundingBoxRight >= object.boundingBoxLeft &&
      self.boundingBoxLeft <= object.boundingBoxRight &&
      self.boundingBoxBottom >= object.boundingBoxTop &&
      self.boundingBoxTop <= object.boundingBoxBottom

    if (!isColliding) return false

    // Defer to custom collision detection logic
    if (typeof cb === 'function') {
      return cb(self, object)
    }

    // Fallback to default collision detection logic
    if (withAny) return true
    if (withSolid) return !!object.solid

    return name === object.name
  })
}
