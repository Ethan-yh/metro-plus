<template>
  <el-table :data="list" style="width: 100%; padding-top: 15px">
    <el-table-column label="故障线路" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.line_name }}
      </template>
    </el-table-column>
    <el-table-column label="故障信息" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.msg }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" align="center">
      <template slot-scope="{ row }">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from "@/api/remote-search";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        'solved': "success",
        'unsolved': "danger",
      };
      return statusMap[status];
    },
    orderNoFilter(str) {
      return str.substring(0, 30);
    },
  },
  data() {
    return {
      list: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // transactionList().then(response => {
      //   this.list = response.data.items.slice(0, 8)
      //   console.log(this.list)
      // })
      this.$axios({
        method: "post",
        url: "/fault/getLineFaultDate",
      }).then((res) => {
        if (res.data.status == 0) {
          this.list = res.data.records;
        }
      });
    },
  },
};
</script>
