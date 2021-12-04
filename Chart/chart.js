const X_AXIS_PADDING = 10;
const Y_AXIS_PADDING = 25;
const DURATION = 1000 * 30; // 30s
const MAX_VALUE = 100;
const Y_TICK_COUNT = 5;
const TOP_PADDING = 15;

class LineChart {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');

    // 차트 크기 설정
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.chartWidth = this.canvasWidth - Y_AXIS_PADDING;
    this.chartHeight = this.canvasHeight - X_AXIS_PADDING - TOP_PADDING;

    this.drawChart();
  }

  // 시간을 실시간
  setTime = () => {

  }

  // 그리기
  drawChart = () => {
    const { ctx, canvasWidth, canvasHeight, chartHeight, chartWidth } = this;

    ctx.beginPath();
    ctx.moveTo(Y_AXIS_PADDING, TOP_PADDING);

    // y축 선 그리기
    ctx.lineTo(Y_AXIS_PADDING, chartHeight);
    const y_interavl = MAX_VALUE / (Y_TICK_COUNT - 1);

    // 숫자 표기(오른쪽 정렬)
    ctx.textAlign = "right";

    // y축 숫자 표기 범위
    for (let i = 0; i < Y_TICK_COUNT; i++) {
      const value = i * y_interavl;
      const yPoint = TOP_PADDING + chartHeight - value / MAX_VALUE * chartHeight;

      // 출력 부분 설정
      ctx.fillText(value, Y_AXIS_PADDING - 3 , yPoint);
    }

    // x축 선 그리기
    ctx.lineTo(canvasWidth, chartHeight);
    ctx.stroke();

    // let currentTime = this.startTime - this.startTime % this.xTimeInterval;
    // while (currentTime < this.endTime + this.xTimeInterval) {
    //   const xPoint = (currentTime - this.startTime ) / DURATION * chartWidth;
    //   const date = currentTime += this.xTimeInterval;
    //   const text = date.getMinutes() + ':' + date.getSeconds();
    //
    //   ctx.fillText(text, xPoint, chartHeight + TOP_PADDING + 4);
    //   currentTime += this.xTimeInterval;
    // }
  }

  // 데이터 갱신
  updateData = () => {

  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LineChart('lineChart');
})