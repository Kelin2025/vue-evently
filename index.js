export default {
  beforeCreate() {
    const self = this

    const createCaller = evt => (method, ...res) => {
      if (self[`${evt}:${method}`]) {
        return self[`${evt}:${method}`](...res)
      } else {
        return null
      }
    }

    self.$evently = {
      emit(evt, ...args) {
        const call = createCaller(evt)

        call("start", ...args)
        if (!self.$listeners[evt]) return null
        return new Promise((resolve, reject) => {
          self.$emit(evt, ...args, {
            resolve(res) {
              call("done", res)
              call("finish", res, true)
              resolve(res)
            },
            reject(res) {
              call("fail", res)
              call("finish", res, false)
              reject(res)
            },
            trigger(method, ...args) {
              return call(method, ...args)
            }
          })
        })
      },
      share(evt, ...data) {
        const call = createCaller(evt)

        const child = data.slice(-1)[0]

        return new Promise((resolve, reject) => {
          self.$emit(evt, ...data, {
            resolve(res) {
              child.resolve(res)
              resolve(res)
            },
            reject(res) {
              child.reject(res)
              reject(res)
            },
            trigger(method, ...args) {
              return child.trigger(method, ...args)
            }
          })
        })
      }
    }
  }
}
