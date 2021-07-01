<template>
  <div>
    <el-button type="primary" @click="addLine">添加线路</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="名字"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="editLine(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button @click="removeLine(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑线路" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="线路名字">
          <el-input v-model="form.name" :disabled="nameEdit"></el-input>
        </el-form-item>
        <el-form-item label="线路颜色">
          <el-color-picker v-model="form.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="途径路线及偏移位置">
          <el-input
            type="textarea"
            v-model="form.stations"
            :autosize="{ minRows: 2, maxRows: 6 }"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Fault",
  data() {
    return {
      tableData: [],
      form: {
        name: "",
        color: "",
        stations: "",
      },
      dialogVisible: false,
      nameEdit: false,
    };
  },
  methods: {
    refreshData() {
      console.log("刷新数据");
      this.$axios({
        method: "post",
        url: "/line/getAllLines",
      }).then((res) => {
        if (!res.data.status) {
          this.tableData = res.data.lines;
          console.log(this.tableData);
        }
      });
    },
    getLineStatiosStr(stations) {
      var lineStationsInfo = "";

      lineStationsInfo += stations[0].name;
      lineStationsInfo += "-";
      lineStationsInfo += stations[0].azimuth;
      for (let i = 1; i < stations.length; i++) {
        lineStationsInfo += ",";
        lineStationsInfo += stations[i].name;
        lineStationsInfo += "-";
        lineStationsInfo += stations[i].azimuth;
      }
      return lineStationsInfo;
    },
    editLine(item) {
      this.dialogVisible = true;
      this.nameEdit = true;
      this.form.name = item.name;
      this.form.color = item.color;
      this.form.stations = this.getLineStatiosStr(item.stations);
    },
    addLine() {
      this.dialogVisible = true;
      this.nameEdit = false;
      this.form.name = "";
      this.form.color = "";
      this.form.stations = "";
    },
    removeLine(item) {
      this.$axios({
        method: "post",
        url: "edit/removeLine",
        data: { name: item.name },
      }).then((res) => {
        if (res.data.status == 0) {
          this.$message.success("删除成功");
          const self = this;
          setTimeout(function () {
            self.refreshData();
          }, 2000);
        } else {
          this.$message.success(`删除失败:${res.data.msg}`);
        }
      });
    },
    onSubmit() {
      this.dialogVisible = false;
      //   this.form.line_name = this.lines[this.lineIndex].name;
      if (this.nameEdit) {
        this.$axios({
          method: "post",
          url: "edit/editLine",
          data: this.form,
        }).then((res) => {
          if (res.data.status == 0) {
            this.$message.success("修改成功");
            const self = this;
            setTimeout(function () {
              self.refreshData();
            }, 2000);
          } else {
            this.$message.success(`修改失败:${res.data.msg}`);
          }
        });
      } else {
        this.$axios({
          method: "post",
          url: "edit/addLine",
          data: this.form,
        }).then((res) => {
          if (res.data.status == 0) {
            this.$message.success("添加成功");
            const self = this;
            setTimeout(function () {
              self.refreshData();
            }, 2000);
          } else {
            this.$message.success(`添加失败:${res.data.msg}`);
          }
        });
      }
    },
  },
  mounted() {
    this.refreshData();
  },
};
</script>


