<template>
  <div class="outer">
    <div class="article-container">
      <div class="article" v-for="(item, n) in articleList" :key="n">
        <div class="title" @click="openText(item)">{{item.title}}</div>
        <div class="summary">
          {{item.summary}}
        </div>
        <div class="bottom">
          <div class="tag">{{item.tag}}</div>
          <!-- <div class="comment" >{{item.commentCount}}</div> -->
          <div class="like"@click="like">{{item.likeCount}}</div>
          <!-- <div class="read">{{item.readCount}}</div> -->
        </div>
      </div>
    </div>
    <div v-if="articleList.length === 0 && !isLoading" style="display:flex; justify-content: center; align-items: center; color: #808695"> 没有内容 </div>
    <div class="loading" v-show="isLoading" style="position: absolute; left: 50%; transform: translate(-50%,0%);">
      <Loading/>
    </div>
    <div class="no-article">
      <transition name="noArticleFade">
        <span v-show="noArticle && articleList.length !== 0">没有内容了</span>
      </transition>
    </div>
  </div>
</template>

<script>
  import Loading from "@/components/Loading";
  export default {
  
    components: {
      Loading
    },
    data() {
      return {};
    },
    computed: {
      articleList() {
        return this.$store.state.articleList;
      },
      isLoading() {
        return this.$store.state.isLoading;
      },
      noArticle() {
        return this.$store.state.noArticle;
      }
    },
    methods: {
      openText(data) {
        console.log("查看全文", data);
        this.$router.push({
          path: `/detail/${data._id}`
        });
      },
      getDate(date) {
        return moment(Number(date)).format("YYYY-MM-DD");
      },
      like() {
        
      }
    },
  };
</script>

<style lang="scss" scoped>
  .outer {
    min-height: 105vh;
    position: relative;
  }
  
  .article-container {
    padding: 20px 10px;
    &>.article:not(:last-of-type) {
      border-bottom: 1px solid #f0f0f0;
    }
  }
  
  .loading {
    display: flex;
    justify-content: center;
    margin-top: -70px;
    padding-top: 20px;
  }
  
  .no-article {
    text-align: center;
    color: #999;
    font-size: 14px;
    margin-top: -80px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 50%);
    height: 30px;
  }
  
  .article {
    background: #fff;
    box-sizing: border-box;
    padding: 10px;
    margin-bottom: 10px;
    height: 200px;
    cursor: pointer;
    .title {
      word-break: break-all;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.5;
    }
    .title:hover {
      text-decoration: underline;
    }
    .summary {
      margin-top: 10px;
      word-break: break-all;
      font-size: 14px;
      line-height: 24px;
      color: #888;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      /* autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 2;
    }
    .bottom {
      display: flex;
      margin-top: 10px;
      &>div {
        margin-right: 20px;
        padding: 0px 20px;
        color: #b4b4b4;
        font-size: 14px;
      }
      .read {
        background-image: url(../../static/read.svg);
        background-repeat: no-repeat;
        background-position: 0 0px;
        background-size: contain;
      }
      .like {
        background-image: url(../../static/like.svg);
        background-repeat: no-repeat;
        background-position: 0 0px;
        background-size: contain;
      }
      .tag {
        width:30px;
        background-image: url(../../static/tag.svg);
        background-repeat: no-repeat;
        background-position: 0 0px;
        background-size: contain;
      }
      .comment {
        background-image: url(../../static/comment.png);
        background-repeat: no-repeat;
        background-position: 0 1px;
        background-size: contain;
      }
    }
    & img {
      height: 200px;
      width: 300px;
    }
    .desc {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      width: 100%;
      justify-content: space-between;
      .underline {
        display: flex;
        justify-content: space-between;
        color: #888;
        font-size: 14px;
        div {
          padding-left: 20px;
          background-repeat: no-repeat;
          background-position: 0px 3px;
        }
        .clock {
          background-image: url(../../static/clock.png);
        }
      }
    }
  }
  
  .noArticleFade-enter-active,
  .noArticleFade-leave-active {
    transition: opacity 0.3s;
  }
  
  .noArticleFade-enter,
  .noArticleFade-leave-to {
    opacity: 0;
  }
  
  @media screen and (max-width: 1060px) {
    .read,
    .comment,
    .text {
      display: none !important;
    }
    .title {
      font-size: 16px !important;
      line-height: 23px !important;
    }
    .article {
      height: 150px;
    }
    .loading {
      margin-top: -60px;
    }
    .no-article {
      margin-top: -30px;
    }
  }
</style>