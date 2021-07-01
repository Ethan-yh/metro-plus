<template>
  <div class="home">
    <el-button size="small" @click="searchPath">查询路线</el-button>
    <el-checkbox v-model="isShowPassEntry" @change="showRealPassEntry"
      >显示进站量</el-checkbox
    >
    <el-radio v-model="passEntryMode" label="now">当前进站量</el-radio>
    <el-radio v-model="passEntryMode" label="his">历史进站量</el-radio>
    <div class="block">
      <span class="demonstration">查询日进站量</span>
      <el-date-picker v-model="dateEntry" type="date" placeholder="选择日期">
      </el-date-picker>
    </div>
    <span>时间:{{time}}</span>
    <el-slider
      v-model="timeSliderValue"
      :min="0"
      :max="288"
      @input="timeChange"
    ></el-slider>
    <el-drawer
      title="实时位置与乘客量"
      :visible.sync="showPosDrawer"
      direction="btt"
      size="40%"
    >
      <el-row>
        <el-col :span="18"
          ><div
            ref="canvas-pos"
            style="background-color: #fff; width: 100%; height: 250px"
          ></div
        ></el-col>
        <el-col :span="6">
          <div class="passVolTable-container">
            <span>列车号: {{ trainSelected }}</span>
            <el-table :data="passVolTable" style="width: 100%" height="250px">
              <el-table-column prop="carriageNo" label="车厢号">
              </el-table-column>
              <el-table-column prop="vol" label="乘客量"> </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-drawer>

    <div
      ref="canvas-metro"
      style="background-color: #fff; width: 100%; height: 900px"
    ></div>
  </div>
</template>

<script>
// @ is an alias to /src
import quneeMetro from "./drawMetro/drawMetro";
import drawPos from "./drawMetro/drawPos";

export default {
  name: "Metro",
  data() {
    return {
      lineDirection: 0,
      passVolTable: [],
      trainSelected: "",
      showPosDrawer: false,
      isShowPassEntry: false,
      dateEntry: "",
      entryData: [],
      timeSliderValue: 0,
      passEntryMode: "now",
      time:"0:00"
    };
  },
  methods: {
    async searchPath(){
      const od = quneeMetro.getOD();
      if(!od.o_sid||!od.d_sid){
        return;
      }
      const res = await this.$axios({
        method:"post",
        url: "/path/getPath",
        data: od,
      });
      if(res.data.status){
        console.log(res.data.msg);
        return;
      }
      quneeMetro.drawPath(res.data.path)
    },
    async searchEntry() {
      if (this.dateEntry == "") {
        return;
      }
      const res = await this.$axios({
        method: "post",
        url: "/passEntry/getPassEntryAllDay",
        data: { date: this.dateEntry },
      });
      if (res.data.status) {
        console.log(res.data.msg);
        return;
      }

      this.entryData = res.data.records;
    },
    async timeChange(minutegroup) {
      this.time = ''+parseInt(minutegroup*5/60)+":"+parseInt(minutegroup*5%60);
      const res = await this.$axios({
        method: "post",
        url: "/passEntry/getPassEntryAllTime",
        data: {
          date: this.dateEntry,
          minutegroup: minutegroup,
        },
      });
      if (res.data.status != 0) {
        console.log(res.data.msg);
        return;
      }
      quneeMetro.clearPassEntry();
      quneeMetro.drawPassEntry(res.data.records);
    },
    async showRealPassEntry(status) {
      console.log(status);
      if (status) {
        if (this.passEntryMode == "now") {
          const res = await this.$axios({
            method: "post",
            url: "/passEntry/getPassEntryAll",
          });
          if (res.data.status != 0) {
            console.log(res.data.msg);
            return;
          }

          quneeMetro.drawPassEntry(res.data.records);
        } else {
          if (this.dateEntry == "") {
            return;
          }
          console.log(this.dateEntry)
          const res = await this.$axios({
            method: "post",
            url: "/passEntry/getPassEntryAllTime",
            data: {
              date: this.dateEntry,
              minutegroup: this.timeSliderValue,
            },
          });
          if (res.data.status != 0) {
            console.log(res.data.msg);
            return;
          }

          quneeMetro.drawPassEntry(res.data.records);
        }
      } else {
        quneeMetro.clearPassEntry();
      }
    },
    async passVolData(train_id) {
      let res = await this.$axios({
        method: "post",
        url: "/passVol/getPassVol",
        data: { train_id: train_id },
      });
      if (res.data.status != 0) {
        console.log(res.data.msg);
        return;
      }
      console.log("乘客量信息", res.data.record);
      this.passVolTable = [];
      for (let i in res.data.record.vols) {
        this.passVolTable.push({ carriageNo: i, vol: res.data.record.vols[i] });
      }
    },
    async posData(line) {
      // this.$refs["canvas-pos"].innerHTML = "";
      const rLineId = line.id + "-" + this.lineDirection;
      let res = await this.$axios({
        method: "post",
        url: "/line/getLine",
        data: { id: rLineId },
      });
      if (res.data.status != 0) {
        console.log(res.data.msg);
        return;
      }
      const rLine = res.data.lines[0];

      res = await this.$axios({
        method: "post",
        url: "/getMetroPos",
        data: { line: { id: rLineId } },
      });
      if (res.data.status != 0) {
        console.log(res.data.msg);
        return;
      }

      console.log("位置信息:", res.data.poss);

      const graph = drawPos(this.$refs["canvas-pos"], {
        line: rLine,
        poss: res.data.poss,
      });

      // 交互事件
      const self = this;
      graph.addCustomInteraction({
        onclick: function (evt, graph) {
          var element = graph.getElementByMouseEvent(evt);

          if (element) {
            if (element.mtype == "train") {
              self.trainSelected = element.data;
              self.passVolData(element.data);
            }
          } else {
          }
        },
      });
    },
    metroData() {
      const self = this;
      this.$axios({
        method: "get",
        url: "/getMetroData",
      }).then((res) => {
        console.log(res);
        if (res.status == 200) {
          const graph = quneeMetro.drawMetro(
            this.$refs["canvas-metro"],
            res.data.data
          );
          graph.addCustomInteraction({
            onclick: function (evt, graph) {
              var element = graph.getElementByMouseEvent(evt);

              if (element) {
                if (element.mtype == "line") {
                  self.showPosDrawer = true;
                  self.posData(element.data);
                }
              } else {
              }
            },
          });
        }
      });
    },
  },
  mounted() {
    this.metroData();
  },
};
</script>
