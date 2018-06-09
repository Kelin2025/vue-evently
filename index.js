export default {
  beforeCreate() {
    const self = this

    const call = (evt, method, ...res) => {
      if (self[`${evt}:${method}`]) {
        self[`${evt}:${method}`](...res)
      }
    }

    this.$evently = {
      $emit(evt, ...args) {
        self.$emit(`sync:${evt}`, ...args)
        if (!self.$listeners[`async:${evt}`]) return null
        return new Promise((resolve, reject) => {
          self.$emit(`async:${evt}`, ...args, {
            resolve(res) {
              call(evt, "done", res)
              call(evt, "finish", res, true)
              resolve(res)
            },
            reject(res) {
              call(evt, "fail", res)
              call(evt, "finish", res, false)
              reject(res)
            }
          })
        })
      }
    }
  }
}
