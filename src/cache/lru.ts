interface Options {
  max: number
  maxAge: number
}

class LRUNode {
  key: string
  value: string
  timestamp: number
  next = null
  prev = null

  constructor(key: string, value: string, next = null, prev = null) {
    this.key = key
    this.value = value
    this.timestamp = Date.now()
    this.next = next
    this.prev = prev
  }
}

class LRU {
  size = 0
  max = 100
  maxAge = 1000 * 60
  head = null
  tail = null
  cache: Record<string, LRUNode> = {}

  constructor({ max, maxAge }: Options) {
    this.max = max
    this.maxAge = maxAge
  }

  // Write Node to head of LinkedList
  // update cache with Node key and Node reference
  set(key, value) {
    if (this.size === this.max) {
      this.remove(this.tail.key)
    }

    if (!this.head) {
      this.head = this.tail = new LRUNode(key, value)
    } else {
      const node = new LRUNode(key, value, this.head)
      this.head.prev = node
      this.head = node
    }

    //Update the cache map
    this.cache[key] = this.head
    this.size++
  }

  // Read from cache map and make that node as new Head of LinkedList
  get(key) {
    if (this.cache[key]) {
      const node = this.cache[key]
      if (!node) {
        return
      }

      const { timestamp, value } = node

      if (timestamp + this.maxAge <= Date.now()) {
        this.remove(key)
        return
      }

      // Lift
      this.remove(key)
      this.set(key, value)

      return value
    }
  }

  remove(key) {
    const node = this.cache[key]
    if (!node) {
      return
    }

    if (node.prev !== null) {
      node.prev.next = node.next
    } else {
      this.head = node.next
    }

    if (node.next !== null) {
      node.next.prev = node.prev
    } else {
      this.tail = node.prev
    }

    delete this.cache[key]
    this.size--
  }

  reset() {
    this.head = null
    this.tail = null
    this.size = 0
    this.cache = {}
  }
}

export default LRU