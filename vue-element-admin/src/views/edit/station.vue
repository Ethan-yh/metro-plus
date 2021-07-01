<template>
  <div>
    <el-button type="primary" @click="addStation">添加站点</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="名字"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="editStation(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button @click="removeStation(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑站点" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="站点名字">
          <el-input v-model="form.name" :disabled="nameEdit"></el-input>
        </el-form-item>
        <el-form-item label="x坐标">
          <el-input-number v-model="form.x" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="y坐标">
          <el-input-number v-model="form.y" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="标签位置">
          <el-select v-model="form.labelPos" placeholder="请选择坐标">
            <el-option
              v-for="(item, i) in labelPoss"
              :key="i"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
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
        x: "",
        y: "",
        labelPos: "",
      },
      dialogVisible: false,
      labelPoss: [
        "bottom",
        "top",
        "left",
        "right",
        "bottomleft",
        "bottomright",
        "topleft",
        "topright",
      ],
      nameEdit: false,
    };
  },
  methods: {
    refreshData() {
      console.log("刷新数据");
      this.$axios({
        method: "post",
        url: "/station/getAllStations",
      }).then((res) => {
        if (!res.data.status) {
          this.tableData = res.data.stations;
          console.log(this.tableData);
        }
      });
    },
    editStation(item) {
      this.dialogVisible = true;
      this.nameEdit = true;
      this.form.name = item.name;
      this.form.x = item.x;
      this.form.y = item.y;
      this.form.labelPos = item.labelPos;
    },
    addStation() {
      this.dialogVisible = true;
      this.nameEdit = false;
      this.form.name = '';
      this.form.x = 0;
      this.form.y = 0;
      this.form.labelPos = 'bottom';
    },
    removeStation(item) {
      this.$axios({
        method: "post",
        url: "edit/removeStation",
        data: { name: item.name },
      }).then((res) => {
        if (res.data.status == 0) {
          this.$message.success("删除成功");
          const self = this;
          setTimeout(function () {
            self.refreshData();
          }, 2000);
        }
      });
    },
    onSubmit() {
      this.dialogVisible = false;
      //   this.form.line_name = this.lines[this.lineIndex].name;
      if (this.nameEdit) {
        this.$axios({
          method: "post",
          url: "edit/editStation",
          data: this.form,
        }).then((res) => {
          if (res.data.status == 0) {
            this.$message.success("修改成功");
            const self = this;
            setTimeout(function () {
              self.refreshData();
            }, 2000);
          }
        });
      } else {
        this.$axios({
          method: "post",
          url: "edit/addStation",
          data: this.form,
        }).then((res) => {
          if (res.data.status == 0) {
            this.$message.success("添加成功");
            const self = this;
            setTimeout(function () {
              self.refreshData();
            }, 2000);
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


