<template>
  <div id="app">
    <header>
      <div class="title" v-if="headShow">
        <div v-if="!isLogin">
          <span click @click="register">注册 - &nbsp;</span>
          <span click @click="login">登录</span>
          <span class="name" style="font-size:16px">liyonglong的技术博客</span>
        </div>
        <div user v-else>
          <label for="pic" style="font-size: 14px">
            <span v-if="!avatorUrl" click>设置头像</span>
            <img v-if="avatorUrl" :src="avatorUrl" alt title="点击可更换头像">
          </label>
          <input type="file" id="pic" name="avator" @change="getPicture">
          {{username}}
          <span
            click
            style="font-size: 12px; margin-left: 10px"
            @click="logout"
          >退出</span>
          <span class="name" style="font-size:16px">liyonglong的技术博客</span>
        </div>
      </div>
      <Tab v-if="headShow"/>
    </header>
    <div class="container">
      <div class="main">
        <div class="mobile-tag">
          <MobileTag/>
          <div search>
            <input v-model="keyWord" type="text" placeholder="输入关键词搜索" @keyup.enter="goSearch">
            <span @click="goSearch"></span>
          </div>
        </div>
        <router-view/>
      </div>
      <div class="side">
        <div class="intro">
          <div class="side-title">About Me</div>
          <div class="avator" @click="goToMange" :style="{cursor: admin ? 'pointer' : '' }">
            <img :src="icon" alt>
          </div>
          <ul class="right">
            <li>
              Email：
              <a href="mailto:liyonglong_bupt@163.com">liyonglong_bupt@163.com</a>
            </li>
            <li>
              Github:
              <a href="https://github.com/silentport">https://github.com/silentport</a>
            </li>
          </ul>
        </div>
        <div class="search">
          <input v-model="keyWord" type="text" placeholder="输入搜索词" @keyup.enter="goSearch">
          <div @click="goSearch">搜索</div>
        </div>
        <Tag/>
      </div>
    </div>
    <component :is="componentId" v-if="dialogShow"></component>
    <footer>
      <button @click="resetTop">回到顶部</button>
    </footer>
  </div>
</template>

<script>
const icon = require("../static/icon.jpg");
import { host } from "../config";
import { mapActions } from "vuex";
import Tab from "@/components/Tab";
import Tag from "@/components/Tag";
import Login from "@/components/Login";
import MobileTag from "@/components/MobileTag";
import Register from "@/components/Register";
import { setInterval, clearInterval } from "timers";
require("es6-promise").polyfill();
require("isomorphic-fetch");

export default {
  name: "App",
  components: {
    Tab,
    Tag,
    Login,
    Register,
    MobileTag
  },
  data() {
    return {
      icon: icon,
      headShow: false,
      beforeScrollTop: 0,
      keyWord: ""
    };
  },
  computed: {
    dialogShow() {
      return this.$store.state.dialogShow;
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
    componentId() {
      return this.$store.state.componentId;
    },
    username() {
      return this.$store.state.username;
    },
    avatorUrl() {
      return this.$store.state.avator;
    },
    isLoading() {
      return this.$store.state.isLoading;
    },
    admin() {
      return this.$store.state.admin;
    }
  },
  async created() {
    const res = await this.$request({
      path: "home",
      data: {},
      method: "GET"
    });
    if (res.hasUser) {
      if (res.admin) {
        this.$store.commit("getAdmin");
      }
      this.$store.commit("login");
      this.$store.commit("getUsername", res.username);
      this.$store.commit("getAvator", res.avator);
      this.$store.commit("hideDialog", "isLogin");
    }
    this.headShow = true;
  },
  async mounted() {
    this.$store.commit("switchLoading");
    this.getCatagory({
      vm: this
    });
    if (!location.href.includes("detail")) {
      await this.getArticle({
        vm: this,
        page: this.$store.state.curPage,
        tag: this.$store.state.tag
      });
    }
    this.$store.commit("switchLoading");
    this.beforeScrollTop = app.scrollTop;

    app.addEventListener(
      "scroll",
      this.debounce(this.scrollHandler, 200, 1000)
    );
  },
  methods: {
    register() {
      this.$store.commit("openDialog");
      this.$store.commit("componentName", "Register");
    },
    login() {
      this.$store.commit("openDialog");
      this.$store.commit("componentName", "Login");
    },
    async logout() {
      const res = await this.$request({
        path: "logout",
        data: { username: this.username },
        method: "POST"
      });
      this.$store.commit("logout");
    },
    async getPicture(e) {
      try {
        const res = await this.$request({
          path: "upload/avator",
          data: {
            avator: e.target.files[0],
            username: this.$store.state.username
          },
          method: "POST"
        });
        this.avator = res.avator;
        this.$store.commit("getAvator", res.avator);
      } catch (err) {
        console.log(err);
      }
    },
    debounce(fn, wait, maxTimelong) {
      var timeout = null,
        startTime = Date.parse(new Date());

      return function() {
        if (timeout !== null) clearTimeout(timeout);
        var curTime = Date.parse(new Date());
        if (curTime - startTime >= maxTimelong) {
          fn();
          startTime = curTime;
        } else {
          timeout = setTimeout(fn, wait);
        }
      };
    },
    async scrollHandler() {
      if (this.$route.path.includes("detail")) {
        return;
      }
      if (this.$store.state.isLoading && this.$store.state.noArticle) {
        return;
      }

      function isReachedBottom() {
        // 手机浏览器会有1px误差
        return app.scrollHeight - app.clientHeight - app.scrollTop < 3;
      }
      let afterScrollTop = app.scrollTop;
      // 向上滚
      if (afterScrollTop - this.beforeScrollTop < 0) {
        this.beforeScrollTop = afterScrollTop;
        console.log("up");
        return;
      }
      if (isReachedBottom()) {
        this.getNextPage();
      }
      this.beforeScrollTop = afterScrollTop;
    },
    async getNextPage() {
      this.$store.commit("switchLoading");
      this.$store.commit("nextPage");
      await this.getArticle({
        vm: this,
        page: this.$store.state.curPage,
        tag: this.$store.state.tag
      });
      this.$store.commit("switchLoading");
    },
    async goSearch() {
      if (!this.keyWord) {
        return;
      }
      if (this.$route.path.includes("detail")) {
        this.$router.go(-1);
      }
      this.$store.commit("switchLoading");
      await this.getArticle({
        vm: this,
        page: this.$store.state.curPage,
        tag: this.$store.state.tag,
        keyWord: this.keyWord
      });
      this.$store.commit("switchLoading");
    },
    goToMange() {
      if (this.admin) {
        location.href = `${host}/admin`;
      }
    },
    resetTop() {
      if (app && app.scrollTo) {
        let timer = null;
        let scrollTop = app.scrollTop;
        timer = setInterval(() => {
          scrollTop > 0
            ? app.scrollTo(0, (scrollTop -= 100) > 0 ? scrollTop : 0)
            : clearInterval(timer);
        }, 0);
      }
    },
    ...mapActions(["getArticle", "getCatagory"])
  }
};
</script>

<style lang="scss" scoped>
@import url(./components/css/side.css);
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: relative;
  background: #fff;
  height: 100vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.loading {
  position: absolute;
  left: 40%;
}

header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
  display: flex;
  height: 70px;
  position: fixed;
  z-index: 999;
  top: 0px;
  .title {
    color: #dee;
    font-size: 30px;
    line-height: 70px;
    width: 500px;
    font-weight: bolder;
    .name {
      // width: 200px;
      font-size: 30px;
      display: block;
      margin-left: 40px;
      content: "liyonglong的技术博客";
      font-weight: 700;
      color: #ea6f20;
    }
    label[for="pic"] {
      color: #689;
      display: inline;
      margin-right: 10px;
      cursor: pointer;
    }
    input[type="file"] {
      display: none;
    }
    & > div {
      display: flex;
      padding-left: 30px;
    }
    & > div > span {
      font-size: 16px;
      color: #969696;
      vertical-align: middle;
      display: inline-block;
    }
    & > div > span[click] {
      cursor: pointer;
    }
    div[user] {
      box-sizing: border-box;
      height: inherit;
      text-align: left;
      padding-left: 20px;
      font-weight: normal;
      font-size: 18px;
      color: #666;
      img {
        height: 40px;
        min-width: 40px;
        min-height: 4opx;
        background: #eee;
        width: 40px;
        vertical-align: middle;
        margin-right: 10px;
        border-radius: 50%;
      }
    }
  }
}

.container {
  display: flex;
  margin-bottom: 20px;
  width: 75%;
  margin: 90px auto 20px;
  .mobile-tag {
    display: none;
  }
  .main {
    width: 65%;
    min-height: 50px;
    background: #fff;
    text-align: left;
  }
  .side {
    width: 270px;
    margin-left: 10px;
    .intro {
      // box-shadow: 4px 4px 3px #aaa;
      border-radius: 10px;
      padding-bottom: 20px;
      background: rgb(249, 249, 249);
      .avator {
        padding-bottom: 20px;
        img {
          width: 120px;
          min-height: 120px;
          min-width: 120px;
          background: rgb(249, 249, 249);
          height: 120px;
          border-radius: 50%;
        }
      }
      ul {
        text-align: left;
        color: #666;
        & > li {
          line-height: 30px;
          width: 250px;
          box-sizing: border-box;
          padding-left: 16px;
          word-break: break-all;
          color: rgba(0, 0, 0, 0.6);
          font-size: 14px;
          margin: 0 auto;
        }
        & > li > a {
          text-decoration: none;
          word-break: break-all;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
    .search {
      background: rgb(249, 249, 249);
      border-radius: 10px;
      margin-top: 10px;
      text-align: left;
      height: 50px;
      padding: 7px 15px;
      box-sizing: border-box;
      display: flex;
      input {
        height: 35px;
        background: rgb(249, 249, 249);
        box-sizing: border-box;
        margin-left: 0px;
        vertical-align: top;
        outline: none;
        width: calc(100% - 60px);
        border: none;
        border-right: none;
        font-size: 16px;
      }
      div {
        display: inline-block;
        border-radius: 10px;
        width: 60px;
        height: 35px;
        background: #ea6f5a;
        text-align: center;
        line-height: 35px;
        color: #eee;
        letter-spacing: 5px;
        font-weight: 700;
        cursor: pointer;
      }
      div:hover {
        background: #ea6f20;
      }
    }
  }
}

footer {
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: 999;
  width: 70px;
  display: flex;
  justify-content: flex-end;

  & > button {
    height: 80px;
    width: 50px;
    margin-right: 18px;
    cursor: pointer;
    background: #fff;
    border: none;
    color: #ea6f20;
    outline: none;
  }
  & > button:active {
    color: red;
  }
}

@media screen and (max-width: 1009px) {
  header {
    height: 47px;
    box-shadow: 0 1px 1px #f0f0f0;
    .title {
      display: none;
    }
  }
  header::before {
    height: 47px;
    font-size: 20px;
    display: block;
    margin-left: 20px;
    line-height: 47px;
    content: "liyonglong的技术博客";
    font-weight: 700;
    color: #ea6f20;
  }
  .tab-container {
    padding-right: 40px !important;
  }
  .container {
    width: 99%;
  }
  .mobile-tag {
    display: block !important;
    width: 100%;
    margin-bottom: 10px;
    // height: 110px;
    box-shadow: 0 1px 1px #f0f0f0;
    & > div[search] {
      display: flex;
      justify-content: left;
      margin-top: 0px;
      padding-left: 20px;
      padding-bottom: 10px;
      input {
        outline: none;
        border-radius: 3px;
        border: 1px solid #ea6f5a;
        height: 25px;
        width: 70%;
        margin-right: 10px;
        padding-left: 5px;
      }
      span {
        position: relative;
        display: inline-block;
        height: 29px;
        line-height: 25px;
        font-weight: 900;
        cursor: pointer;
        width: 50px;
        padding: 0px 5px;
        box-sizing: border-box;
      }
      span:before {
        display: block;
        height: 18px;
        width: 18px;
        position: absolute;
        content: "";
        border: 2px solid #666;
        border-radius: 50%;
        top: 2px;
      }
      span:after {
        display: block;
        height: 20px;
        width: 10px;
        content: "";
        border-bottom: 2px solid #666;
        transform: rotate(45deg);
        top: 5px;
        left: 28px;
        position: absolute;
      }
      span:active:before,
      span:active:after {
        border-color: #000;
      }
    }
  }
  .main {
    width: 100%;
  }
  .side {
    display: none;
  }
  .container .main {
    width: 100%;
  }
}
</style>
