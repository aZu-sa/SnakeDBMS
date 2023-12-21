<template>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const debounce = (callback: (...args: any[]) => void, delay: number) => {
      let tid: any
      return function (...args: any[]) {
        const ctx = self
        tid && clearTimeout(tid)
        tid = setTimeout(() => {
          callback.apply(ctx, args)
        }, delay)
      }
    }

    const _ = (window as any).ResizeObserver;
    (window as any).ResizeObserver = class ResizeObserver extends _ {
      constructor (callback: (...args: any[]) => void) {
        callback = debounce(callback, 20)
        super(callback)
      }
    }
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.el-table--border th.gutter:last-of-type {
  display: block!important;
}
</style>
