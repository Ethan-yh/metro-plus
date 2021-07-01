<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="故障线路">
      <el-select v-model="form.line_name" placeholder="请选择故障线路">
        <el-option
          v-for="(line, index) in lines"
          :key="index"
          :label="line.name"
          :value="line.name"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="故障状态">
      <el-select v-model="form.status" placeholder="请选择故障线路">
        <el-option label="未修复" value="unsolved"></el-option>
        <el-option label="修复" value="solved"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="故障时间">
      <el-date-picker
        v-model="form.time"
        type="datetime"
        placeholder="选择日期时间"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="故障信息">
      <el-input type="textarea" v-model="form.msg"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "Fault",
  data() {
    return {
      lineIndex: 0,
      form: {
        line_name: "",
        status: "unsolved",
        time: "",
        msg: "",
      },
      lines: [],
    };
  },
  methods: {
    onSubmit() {
    //   this.form.line_name = this.lines[this.lineIndex].name;
      this.$axios({
        method: "post",
        url: "fault/uploadLineFault",
        data: this.form,
      }).then((res) => {
        if (res.data.status == 0) {
          this.$message.success("上报成功");
        }
      });
    },
  },
  mounted() {
    this.$axios({
      method: "post",
      url: "/line/getAllLines",
    }).then((res) => {
      if (!res.data.status) {
        this.lines = res.data.lines;
      }
    });
  },
};
</script>


