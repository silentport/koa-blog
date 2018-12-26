<template>
  <transition name="dialogFade">
    <div class="dialog" v-show="dialogShow" @click="hideDialog">
      <div class="container">
        <div class="close" @click="hideDialog">关闭</div>
        <slot></slot>
        <div class="bottom">
          {{tip}}
          <loading v-if="isLoading" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Loading from "@/components/Loading";
  export default {
    components: {
      Loading,
    },
    computed: {
      dialogShow() {
        return this.$store.state.dialogShow;
      },
      isLoading() {
        return this.$store.state.isLoading;
      }
    },
    props: {
      tip: String
    },
    methods: {
      hideDialog(e) {
        this.$store.commit("hideDialog", e);
      },
  
    },
  };
</script>

<style lang="scss" scoped>
  .dialog {
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    top: 0px;
    .container {
      width: 300px;
      height: 360px;
      margin-top: 100px;
      background: #E1E1E1;
      border-radius: 10px;
      position: absolute;
      .bottom {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e15748;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        color: #ddd;
        font-size: 13px;
        box-sizing: border-box;
        padding: 0px 5px;
      }
      .close {
        margin-left: calc(100% - 70px);
        width: 50px;
        cursor: pointer;
        color: #888;
        padding: 10px;
      }
    }
  }
  
  .dialogFade-enter-active,
  .dialogFade-leave-active {
    transition: opacity 0.3s;
  }
  
  .dialogFade-enter,
  .dialogFade-leave-to {
    opacity: 0;
  }
</style>
