
<template>
    <div class="detail-container">
       <Button type="primary" :style="{marginBottom: '40px'}"  @click="modal = true">新增</Button>
        <Table border :columns="columns" :data="data"></Table>
        <Modal
        v-model="modal"
        title="输入文章类别名称"
        :loading="loading"
        @on-ok="add"
        @on-cancel="cancel">
        <Input v-model="value" placeholder="Enter something..." style="width: 300px" />
    </Modal>
    </div>
</template>
<script>
import { Button, Modal, Input, Table } from "iview";
export default {
  components: {
    Button,
    Modal,
    Input,
    Table
  },
  data() {
    return {
      modal: false,
      value: "",
      loading: true,
      columns: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "时间",
          key: "date",
          render: (h, params) => {
            return h("span", [
              h("span", {}, moment(params.row.date).format("YYYY-MM-DD"))
            ]);
          }
        },
        {
          title: "数量",
          key: "count",
          render: (h, params) => {
            return h("span", [
              h("span", {}, params.row.count)
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          render: (h, params) => {
            return h("div", [
              h(
                Button,
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.name);
                    }
                  }
                },
                "Delete"
              )
            ]);
          }
        }
      ],
      data: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.data = [];
        const res = await this.$request({
          path: "catagory",
          data: {},
          method: "GET"
        });
        this.data = res.data;
      } catch (msg) {
        this.$Message.info(msg);
      }
    },
    async add() {
      if (!this.checkData()) {
        this.$Message.info("提交内容不能为空");
        this.modal = false;
        return;
      }
      try {
        const res = await this.$request({
          path: "catagory",
          data: { name: this.value, date: Date.parse(new Date()), count: 0 },
          method: "POST"
        });
        if (res && res.name) {
          this.$Message.success(res.msg);
          this.getList();
        }
      } catch (msg) {
        this.$Message.info(msg);
      }

      this.modal = false;
    },
    async remove(name) {
      try {
        const res = await this.$request({
          path: "catagory/" + name,
          data: {},
          method: "DELETE"
        });
        console.log(res);
        if (res && res.name) {
          this.$Message.success(res.msg);
          this.getList();
        }
      } catch (msg) {
        this.$Message.info(msg);
      }
    },
    cancel() {
      this.modal = false;
    },
    checkData() {
      return this.value !== "";
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
