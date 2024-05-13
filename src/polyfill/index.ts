Array.prototype.findIndex = Array.prototype.findIndex || function (predicate) {
  const l = this.length

  for (let i = l - 1; i >= 0; i--) {
    if(predicate(this[i], i, this)) {
      return i
    }
  }

  return -1
}

Array.prototype.findLast = Array.prototype.findLast || function (predicate) {
  const l = this.length

  for (let i = l - 1; i >= 0; i--) {
    if(predicate(this[i], i, this)) {
      return this[i]
    }
  }

  return undefined
}
