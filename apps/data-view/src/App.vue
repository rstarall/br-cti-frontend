<template>
  <div id="app" @dblclick="toggleFullscreen">
    <DataView></DataView>
  </div>
</template>

<script>
import DataView from './components/DataView.vue'
export default {
  name: 'App',
  components: {
    DataView
  },
  async created() {
    await this.$nextTick()
    this.toggleFullscreen()
  },
  methods: {
    toggleFullscreen() {
      const doc = document.documentElement;
      if (!document.fullscreenElement &&    // alternative standard method
          !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
        if (doc.requestFullscreen) {
          doc.requestFullscreen();
        } else if (doc.mozRequestFullScreen) {  // Firefox
          doc.mozRequestFullScreen();
        } else if (doc.webkitRequestFullscreen) {  // Chrome, Safari and Opera
          doc.webkitRequestFullscreen();
        } else if (doc.msRequestFullscreen) {  // IE/Edge
          doc.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
