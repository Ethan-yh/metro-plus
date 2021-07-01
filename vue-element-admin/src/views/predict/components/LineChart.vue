<template>
  <div>
    <el-select v-model="station_sel_index" filterable placeholder="请选择">
      <el-option
        v-for="(item, i) in stations"
        :key="i"
        :label="item.name"
        :value="i"
      >
      </el-option>
    </el-select>
    <el-button type="primary" @click="initChart()">预测</el-button>
    <div
      :class="className"
      :id="id"
      :style="{ height: height, width: width }"
    />
  </div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import NProgress from "nprogress"; // progress bar

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chartpredict",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      id: "predictChart",
      chart: null,
      chartData: [],
      stations: [],
      station_sel_index: 0,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
  },
  mounted() {
    this.$axios({
      method: "post",
      url: "/station/getAllStations",
    }).then((res) => {
      if (res.data.status == 0) {
        this.stations = res.data.stations;
      }
    });
    // this.$nextTick(() => {
    //   this.initChart();
    // });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      NProgress.start();
      this.chart = echarts.init(document.getElementById(this.id), "macarons");
      this.$axios({
        method: "post",
        url: "passEntry/predictEntry",
        data: { station_id: this.stations[this.station_sel_index].id },
      }).then((res) => {
        if (res.data.status == 0) {
          console.log(res.data);
          this.chartData = res.data.result.data;
          console.log(this.chartData);
          this.setOptions(this.chartData);
          NProgress.done();
        }
      });
    },
    setOptions(chartData) {
      this.chart.setOption({
        xAxis: {
          data: ["10分钟前", "5分钟前", "现在", "5分钟后", "10分钟后"],
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        visualMap: {
          show: false,
          dimension: 0,
          pieces: [{ gte: 0, lte: 2, color: "green" }], //pieces的值由动态数据决定
          outOfRange: {
            color: "blue",
          },
        },
        // legend: {
        //   data: legend,
        // },
        series: [
          {
            name: this.stations[this.station_sel_index].name,
            itemStyle: {
              normal: {
                // color: "#ababab",
                lineStyle: {
                  // color: "#ababab",
                  width: 2,
                },
              },
            },
            smooth: true,
            type: "line",
            data: chartData,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
        ],
      });
    },
  },
};
</script>
