<template>
  <div class="mobile-tag-container">
    <span class="tag">标签：</span>
    
       <transition-group name="listFade" tag="ul">
        <li v-if="catagoryShow" :class="{'high-light': curIndex == index}" @click="switchTab(index, item)" v-for="(item, index) in catagoryList" :key="index">{{item.name}}</li>
      </transition-group> 
    
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
      catagoryShow() {
        return this.$store.state.catagoryShow;
      },
      catagoryList() {
        return this.$store.state.catagoryList;
      }
    },
    async created() {
  
    },
    methods: {
  
      async switchTab(index, item) {
        this.curIndex = index;
        this.$store.commit("changeTag", item.name);
        if (app && app.scrollTo) {
          app.scrollTo(0, 0);
        }
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
.mobile-tag-container{
  min-height: 112px;


}
  .tag {
    display: inline-block;
    margin-left: 20px;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
  }
  
  ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    li {
      margin-left: 20px;
      border: 1px solid #ea6f5a;
      padding: 5px 10px;
      text-align: center;
      margin-bottom: 10px;
      color: #ea6f5a;
      font-size: 14px;
      border-radius: 3px;
    }
    li:active {
      background: #eee;
      border: none;
    }
    .high-light {
      background: #ea6f5a;
      color: #fff;
    }
  }
  
  .listFade-enter-active,
  .listFade-leave-active {
    transition: all 0.5s;
    
  }
  
  .listFade-enter-to {
    opacity: 1;
    transform: scale(1);
    transform: rotateX(360deg);
    
  }
  
  .listFade-leave {
    opacity: 1;
    transform: scale(1);
    transform: rotateX(360deg);
   
  }
  .listFade-enter,
  .listFade-leave-to {
    opacity: 0;
    transform: scale(0.3);
    // transform: rotateX(0deg);
  }

</style>
