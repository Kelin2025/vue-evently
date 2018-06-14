## Bad form #1

```js
export default {
  data() {
    return {
      form: {},
      pending: false,
      errors: []
    }
  },
  methods: {
    async submit() {
      this.pending = true
      this.errors = []
      // Not reusable
      const { success, errors } = await API.submitForm(this.form)
      this.pending = false
      if (!success) {
        this.errors = errors
      }
    }
  }
}
```

## Bad form #2

```js
export default {
  data() {
    return {
      form: {},
      pending: false,
      errors: []
    }
  },
  methods: {
    submit() {
      // No way to wait for request finish
      this.$emit("submit", this.form)
      // Or do much worse hacks
      this.$parent.$once("submit:done" /* ... */)
      this.$parent.$once("submit:fail" /* ... */)
    }
  }
}
```

## Good form

```js
export default {
  data() {
    return {
      form: {},
      pending: false,
      errors: []
    }
  },
  methods: {
    async submit() {
      this.pending = true
      this.errors = []
      // 1. Reusable
      // 2. Optional
      // 3. Vue-like style
      const { success, errors } = await this.$evently.$emit("submit", this.form)
      this.pending = false
      if (!success) {
        this.errors = errors
      }
    }
  }
}
```

## Another good form

```js
export default {
  data() {
    return {
      form: {},
      pending: false,
      errors: []
    }
  },
  methods: {
    // Starter
    submit () {
      this.$evently.$emit('submit', this.form)
    },

    // It's started
    'submit:start' (form) {
      this.pending = true
    },

    // If it's done
    'submit:done' (response) {
      console.log(response)
    },

    // If it fails
    'submit:fail' (errors) {
      this.errors = []
    },

    // Call anyway
    'submit:finish' (response, isSuccess) {
      this.pending = false
    }
  }
```

> **NOTE:** if no event listener is provided, `submit:done` will be called
