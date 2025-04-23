<template>
  <div id="top-header" style="-webkit-app-region: drag">
    <dv-decoration-8 class="header-left-decoration" />
    <dv-decoration-5 class="header-center-decoration" />
    <dv-decoration-8 class="header-right-decoration" :reverse="true" />
    <div class="center-title">威胁情报数据动态</div>
  </div>
</template>

<script>
export default {
  name: 'HeaderComponent',
}
</script>

<style lang="less">
#top-header {
  position: relative;
  width: 100%;
  height: 38%;
  margin-bottom:1%;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;

  .header-center-decoration {
    width: 40%;
    height: 60px;
    margin-top: 30px;
  }

  .header-left-decoration, .header-right-decoration {
    width: 25%;
    height: 60px;
  }

  .center-title {
    position: absolute;
    font-size: 30px;
    font-weight: bold;
    left: 50%;
    top: 15px;
    transform: translateX(-50%);
    color: #fff;
  }
}
</style>
