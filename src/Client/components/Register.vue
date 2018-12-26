<template>
  <Dialog :tip="helpTxt">
    <h2>注册</h2>
    <form @submit.prevent="submit">
      <ul>
        <li>
          <input type="text" name="username" id="name" v-model="userInfo.username" placeholder="用户名">
        </li>
        <li>
          <input type="password" name="password" id="password" v-model="userInfo.password" placeholder="密码">
        </li>
        <li>
          <input type="submit" :value="btnTxt">
        </li>
      </ul>
    </form>
  </Dialog>
</template>

<script>
  import Dialog from "@/components/Dialog";
  export default {
    components: {
      Dialog
    },
    data() {
      return {
        userInfo: {
          username: "",
          password: ""
        },
        helpTxt: "",
        btnTxt: "确定"
      };
    },
    methods: {
      submit(e) {
        if (!this.checkData()) {
          return;
        }
  
        if (this.btnTxt === "确定") {
          this.goRegister();
        }
  
        if (this.btnTxt === "登录") {
          this.goLogin();
        }
      },
      async goRegister() {
        try {
          this.$store.commit("switchLoading");
          const res = await this.$request({
            path: "register",
            data: this.userInfo,
            method: "POST"
          });
          this.helpTxt = res.msg + "，点击上方按钮可直接登录";
          this.btnTxt = "登录";
        } catch (msg) {
          this.helpTxt = msg;
        }
        this.$store.commit("switchLoading");
      },
      async goLogin() {
        try {
          this.$store.commit("switchLoading");
          const res = await this.$request({
            path: "login",
            data: this.userInfo,
            method: "POST"
          });
          this.helpTxt = res.msg;
          this.$store.commit("login");
          console.log(res)
          if (res.admin) {
            this.$store.commit("getAdmin");
          }
          this.$store.commit("getUsername", res.username);
          this.$store.commit("hideDialog", "isLogin");
        } catch (msg) {
          this.helpTxt = msg;
        }
        this.$store.commit("switchLoading");
      },
  
      checkData() {
        if (!/^[a-zA-z_][a-zA-Z_0-9]{2,8}$/.test(this.userInfo.username)) {
          this.helpTxt =
            "用户名为3-9位，只能包含下划线、字母和数字，且不能以数字开头";
          return false;
        } else {
          this.helpTxt = "";
        }
  
        if (!/^[a-zA-z0-9_@.-]{6,14}$/.test(this.userInfo.password)) {
          this.helpTxt = "密码为6-14位，只能包含下划线、字母、数字、减号、@和.";
          return false;
        } else {
          this.helpTxt = "";
        }
        return true;
      }
    }
  };
</script>

<style lang="scss" scoped>
  h2 {
    color: #f45b4b !important;
  }
  
  form {
    background: #e1e1e1;
    ul {
      li {
        height: 50px;
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        align-content: center;
        font-size: 20px;
        position: relative;
        label {
          display: inline-flex;
          margin-right: 20px;
          align-items: flex-end;
          vertical-align: bottom;
        }
        label[for="pic"] {
          display: inline-flex;
          background: #009a61;
          margin-top: 12px;
          height: 30px;
          box-sizing: border-box;
          font-size: 10px;
          padding: 10px;
          align-items: center;
          cursor: pointer;
          color: #fff;
        }
        input[type="text"],
        input[type="password"] {
          width: 60%;
          height: 40px;
          border-radius: 20px;
          outline: none;
          border: none;
          padding: 20px;
          box-sizing: border-box;
          background: #cacaca;
        }
        input[type="file"] {
          display: none;
        }
      }
      li[pic] {
        margin-top: 85px;
        img {
          max-width: 100px;
          max-height: 100px;
          height: auto;
        }
      }
      li:last-child {
        margin-top: -10px;
        display: flex;
        margin: 0 auto;
        width: 60%;
        justify-content: flex-end;
        input[type="submit"] {
          display: inline-block;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          -webkit-apperaence: none;
          -webkit-box-sizing: border-box;
          color: #ddd;
          font-size: 17px;
          font-weight: 400;
          width: 80px;
          box-sizing: border-box;
          border-radius: 19px;
          display: inline-block;
          cursor: pointer;
          outline: none;
          border: none;
          height: 40px;
          background: #e15748;
        }
        input[type="submit"]:active {
          background: #818181;
        }
      }
    }
  }
</style>