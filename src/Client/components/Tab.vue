<template>
  <div class="tab-container">
    <div @click="switchTab(index, item)" :class="{'high-light': curIndex == index}" v-for="(item, index) in catagoryList" :key="index">{{item.name}}</div>
  </div>
</template>

<script>
  import {
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        curIndex: 0,
      };
    },
    computed: {
      catagoryList() {
        return this.$store.state.catagoryList;
      }
    },
    async created() {
  
    },
    methods: {
      async switchTab(index, item) {
        if (app && app.scrollTo) {
          app.scrollTo(0, 0);
        };
        this.curIndex = index;
        this.$store.commit("changeTag", item.name);
        
        this.$nextTick(async() => {
          this.$router.replace({
            path: '/'
          })
          this.$store.commit("switchLoading");
          await this.getArticle({
            vm: this,
            page: this.$store.state.curPage
          })
          this.$store.commit("switchLoading");
        })
      },
      ...mapActions([
        'getArticle'
      ]),
    },
  };
</script>

<style lang="scss" scoped>
  .tab-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    // padding-right: 200px;
    box-sizing: border-box;
    // width: calc(100% - 310px);
    margin-left: 0px;
    position: relative;
    .more {
      display: none;
      width: 30px;
      margin-top: 30px;
      height: 30px * (140/521);
    }
    ul {
      display: none;
    }
    @media screen and (max-width: 1000px) {
      .more {
        display: block;
        cursor: pointer;
        transform: scale(0.8);
      }
      ul {
        display: block;
        background: #eee;
        color: #666;
        padding: 10px;
        font-size: 25px;
        text-align: left;
        margin-top: 10px;
        position: absolute;
        box-sizing: border-box;
        border-radius: 10px;
        overflow: hidden;
        // height: 200px;
        top: 60px;
        li {
          list-style: none;
          cursor: pointer;
          width: 120px;
          margin-bottom: 10px;
        }
        li:hover {
          font-weight: bolder;
          color: #489;
        }
      }
      div {
        display: none;
      }
    }
    div {
      width: auto;
      box-sizing: border-box;
      padding: 0 10px;
      font-size: 27px;
      font-weight: 500;
      height: 70px;
      color: #969696;
      line-height: 60px;
      position: relative;
      cursor: pointer;
    }
    div:not(.high-light):hover {
      transition: background 200ms;
      background: rgba(200, 200, 200, 0.2);
    }
    .high-light {
      height: 70px;
      font-size: 27px;
      border-bottom: 3px solid #ea6f5a;
    }
  }
</style>
