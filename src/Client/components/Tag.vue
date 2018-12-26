<template>
  <div class="msg">
    <div class="side-title">
      Tag
    </div>
    <ul>
      <li v-for="(item, index) in catagoryList" :key="index" @click="switchTab(index, item)">
        {{item.name}} - {{ '[' + item.count + ']'}}
      </li>
    </ul>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
  export default {
    data() {
      return {
        data: [],
      }
    },
    computed: {
      catagoryList() {
        return this.$store.state.catagoryList.slice(1);
      }
    },
    mounted() {
  
    },
    methods: {
      async switchTab(index, item) {
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
  @import url(./css/side.css);
  .msg {
    background: #f9f9f9;
    border-radius: 10px;
    margin-top: 10px;
    text-align: left;
    height: 400px;
    padding: 7px 5px;
    box-sizing: border-box;
    // box-shadow: 4px 4px 3px #aaa;
    ul {
      padding-left: 40px;
      li {
        cursor: pointer;
        list-style: disc;
        height: 40px;
        font-size: 16px;
        color: #444;
      }
      li:hover {
        color: #096;
      }
    }
  }
</style>
