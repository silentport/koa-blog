<template>
  <div class="detail-container">
    <Tabs v-model="name" @on-click="changeTab">
      <TabPane label="编辑" name="addOrEdit">
        <Button type="primary" style="margin-bottom: 20px" @click="add">新增</Button>
        <Input
          style="margin-bottom: 30px"
          v-model="data.title"
          type="textarea"
          :autosize="true"
          placeholder="请输入文章标题"
        />
        <div style="width: calc(100% - 20px);height: 500px;margin-bottom: 10px">
          <mavon-editor
            style="height:100%; margin-left: 10px"
            :ishljs="true"
            @imgAdd="imgAdd"
            @imgDel="imgDel"
            v-model="data.content"
          ></mavon-editor>
        </div>
        <div class="select">
          <Input
            style="margin-bottom: 30px"
            v-model="data.summary"
            type="textarea"
            :autosize="true"
            placeholder="请输入文章摘要"
          />
          <Input
            style="margin-bottom: 30px"
            v-model="data.image"
            type="textarea"
            :autosize="true"
            placeholder="请输入缩略图url"
          />
          <Select
            v-model="data.tag"
            style="width:200px;margin-bottom: 30px"
            @on-change="changeCatagory"
            placeholder="请选择一个标签类别"
          >
            <Option
              v-for="(item, index) in selectData"
              :value="item.name"
              :key="index"
            >{{ item.name }}</Option>
          </Select>
          <br>
          <DatePicker type="date" v-model="data.date" placeholder="选择时间" style="width: 200px"></DatePicker>
          <Button type="primary" @click="save">确定</Button>
        </div>
      </TabPane>
      <TabPane label="列表" name="list">
        <div style="margin-bottom: 20px">
          <Input
            v-model="keyWord"
            @keyup.native.enter="goSearch"
            placeholder="输入关键词，点击搜索按钮或enter键搜索"
            style="width: 300px"
          />
          <Button type="primary" @click="goSearch">搜索</Button>
        </div>

        <Card
          :bordered="true"
          style="margin-bottom: 20px; cursor: pointer"
          v-for="(item, n) in articleList"
          @click.native="edit(item)"
          :key="n"
        >
          <p slot="title">{{item.title}}</p>
          <p>{{item.summary}}</p>
        </Card>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import {
  Select,
  Option,
  Input,
  Button,
  Tabs,
  TabPane,
  Card,
  DatePicker
} from "iview";
export default {
  components: {
    Select,
    Option,
    Button,
    Input,
    Tabs,
    TabPane,
    Card,
    DatePicker,
    mavonEditor
  },
  data() {
    return {
      name: "addOrEdit",
      selectData: [],
      articleList: [],
      keyWord: "",
      defaultData: {
        tag: "",
        date: new Date(),
        title: "",
        summary: "",
        image: "",
        content: "",
        readCount: 0,
        likeCount: 0,
        commentCount: 0,
        comments: [],
        _id: ""
      },
      data: {
        tag: "",
        date: new Date(),
        title: "",
        summary: "",
        image: "",
        content: "",
        readCount: 0,
        likeCount: 0,
        commentCount: 0,
        comments: [],
        _id: ""
      }
    };
  },
  computed: {},
  async created() {
    const res = await this.$request({
      path: "catagory",
      data: {},
      method: "GET"
    });
    this.selectData = res.data;
    console.log(this.data)
  },
  methods: {
    changeCatagory(name) {
      this.data.tag = name;
    },
    async imgAdd() {
      try {
        const res = await this.$request({
          path: "upload/article",
          data: {
            article: arguments[1]
          },
          method: "POST"
        });
        this.data.content = this.data.content.replace(
          /![[\s\S]+]\(\d*\)/,
          `<img src='${res.article}'/>`
        );
      } catch (msg) {
        this.$Message.info(msg);
      }
    },
    add() {
      Object.keys(this.defaultData).forEach(key => {
        this.data[key] = this.defaultData[key];
      });
    },
    imgDel() {},
    async save() {
      if (!this.checkData()) {
        return;
      }
      this.data.summary = this.data.summary || "";
      this.data.image = this.data.image || "";
      try {
        const res = await this.$request({
          path: "article",
          method: "POST",
          data: { ...this.data, date: this.data.date.getTime() }
        });
        this.$Message.success(res.msg);
        this.data._id = res._id;
      } catch (msg) {
        this.$Message.error(msg);
      }
    //   console.log(this.data);
    },
    checkData() {
      const { content, title, tag, image, summary } = this.data;
      if (!content || !title || !tag) {
        this.$Message.info("有未填信息不能提交");
        return false;
      }
      return true;
    },
    changeTab(name) {
      if (name === "list") {
        this.getList();
      }
    },
    edit(item) {
      console.log(item);
      this.data = {...item, date: new Date(item.date) };
      this.name = "addOrEdit";
    },
    async getList() {
      this.articleList.length = 0;
      try {
        const res = await this.$request({
          path: "article",
          data: {},
          method: "GET"
        });

        Object.keys(res).forEach(key => {
          if (typeof res[key] === "object") {
            this.articleList.push(res[key]);
          }
        });
      } catch (msg) {
        this.$Message.info(msg);
      }
    },
    async goSearch() {
      try {
        const res = await this.$request({
          path: `article?keyWord=${this.keyWord || ""}`,
          data: {},
          method: "GET"
        });
        this.articleList = res.data;

        if (res.data.length === 0) {
          this.$Message.info("没有包含该词条的文章");
        }
      } catch (msg) {
        this.$Message.info(msg);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.select {
  height: 500px;
  // overflow-y: scroll;
  margin-top: 30px;
}

.detail-container {
  overflow-y: scroll;
  padding-bottom: 150px;
  height: 1000px;
}
</style>