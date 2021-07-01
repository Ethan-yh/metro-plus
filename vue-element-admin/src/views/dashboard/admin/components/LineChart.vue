<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
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
    }
  },
  data() {
    return {
      chart: null,
      chartData:[]
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
    this.$nextTick(() => {
      this.initChart();
    });
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
      this.chart = echarts.init(this.$el, "macarons");
      this.$axios({
        method: "post",
        url: "passVol/getAllLinePassVol",
      }).then((res) => {
        if (res.data.status == 0) {
          console.log(res.data)
          this.chartData = res.data.lineVols;
          this.setOptions(this.chartData);
        }
      });
    },
    setOptions(chartData) {
      const series = [];
      const legend = [];
      for (let i in chartData) {
        series.push({
          name: i,
          itemStyle: {
            normal: {
              color: chartData[i].color,
              lineStyle: {
                color: chartData[i].color,
                width: 2,
              },
            },
          },
          smooth: true,
          type: "line",
          data: chartData[i].records,
          animationDuration: 2800,
          animationEasing: "cubicInOut",
        });
        legend.push(i);
      }
      console.log(series)
      this.chart.setOption({
        xAxis: {
          data: [
            "20分钟前",
            "15分钟前",
            "10分钟前",
            "5分钟前",
            "现在",
          ],
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
        legend: {
          data: legend,
        },
        series: series
      });
    },
  },
};
</script>
