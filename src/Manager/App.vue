<template>
 <div class="layout" v-if="admin">
        <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
            <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']">
                <Submenu :name="index + 1" v-for="(item, index) in menus" :key="index">
                    <template slot="title">
                        <Icon type="ios-navigate"></Icon>
                        {{item.name}}
                    </template>
                    <MenuItem :name="index + 1 + '-' + n + 1" v-for="(it, n) in item.sub" :key="n" @click.native="go(item, it)">{{it.name}}</MenuItem>
                    
                </Submenu>
            </Menu>
        </Sider>
        <Layout :style="{marginLeft: '200px'}">
            <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}"></Header>
            <Content :style="{padding: '0 16px 16px'}">
                <Breadcrumb :style="{margin: '16px 0'}">
                    <BreadcrumbItem>{{menuName}}</BreadcrumbItem>
                    <BreadcrumbItem>{{subMenuName}}</BreadcrumbItem>
                </Breadcrumb>
                <Card>
                    <div style="height: 100vh">
                        <router-view/>
                    </div>
                </Card>
            </Content>
        </Layout>
    </div>
    <div v-else style="text-align: center;padding-top:30px;color:#666">
      您没有权限访问该页面！
    </div>
</template>

<script>
import {
  Card,
  Layout,
  Sider,
  Menu,
  Submenu,
  MenuItem,
  Header,
  Content,
  Icon,
  Breadcrumb,
  BreadcrumbItem
} from "iview";
export default {
  components: {
    Icon,
    Submenu,
    Layout,
    Sider,
    Menu,
    MenuItem,
    Header,
    Content,
    Breadcrumb,
    BreadcrumbItem,
    Card
  },
  async created(){
    const res = await this.$request({
        path: "home",
        data: {},
        method: "GET"
      });
      if (res.hasUser) {
        this.admin = res.admin;
      }
  },
  data() {
    return {
      admin:false,
      menus: [
        {
          name: "后台管理",
          sub: [
            { name: "编辑类别", path: "catagory" },
            { name: "头像管理", path: "avator" },
            { name: "文章管理", path: "article" },
            { name: "评论管理", path: "comment" }
          ]
        }
        // {name: 'item2', sub: ['opt1', 'opt2']},
      ],
      menuName: "后台管理",
      subMenuName: "文章管理"
    };
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  mounted() {
      this.$router.push(`/article`);
  },
  methods: {
    go(item, it) {
      this.menuName = item.name;
      this.subMenuName = it.name;
      this.$router.push(`/${it.path}`);
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.ivu-layout-header {
  height: 0px !important;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.ivu-layout-sider,
.ivu-card-body {
  height: 100vh !important;
}
</style>
