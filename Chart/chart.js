const X_AXIS_PADDING = 15;
const Y_AXIS_PADDING = 25;
const DURATION = 1000 * 10; // 30s
const MAX_VALUE = 100;
const Y_TICK_COUNT = 5;
const TOP_PADDING = 15;
const EX_TEXT = "00:00";

class LineChart {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');

    // 차트 크기 설정
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.chartWidth = this.canvasWidth - Y_AXIS_PADDING;
    this.chartHeight = this.canvasHeight - X_AXIS_PADDING - TOP_PADDING;

    // 실시간 설정
    this.xFormatWidth = this.ctx.measureText(EX_TEXT).width;
    this.data = [];

    this.drawChart();
  }

  /**
   * 시간을 실시간 세팅 함수
   */
  setTime = () => {
    this.endTime = Date.now() - 1000; // 1초 마다 데이터가 자연스럽게 표현
    this.startTime = this.endTime - DURATION;
    this.setXInterval();
  }

  setXInterval = () => {
    let xPoint = 0;
    let timeInterval = 1000;

    while (true) {
      xPoint = timeInterval / DURATION * this.chartWidth;
      if (xPoint > this.xFormatWidth) {
        break;
      }
      timeInterval *= 2;
    }
    this.xTimeInterval = timeInterval;
  }

  /**
   * 차트 그리기 함수
   */
  drawChart = () => {
    const {
      ctx,
      canvasWidth,
      canvasHeight,
      chartHeight,
      chartWidth
    } = this;

    this.setTime();

    // 그림(초기화)
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.moveTo(Y_AXIS_PADDING, TOP_PADDING);

    // y축 선(line) 그리기
    ctx.lineTo(Y_AXIS_PADDING, chartHeight + TOP_PADDING);
    const y_interavl = MAX_VALUE / (Y_TICK_COUNT - 1);

    // 숫자 표기(오른쪽 정렬)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    // y축 숫자 표기 범위
    for (let i = 0; i < Y_TICK_COUNT; i++) {
      const value = i * y_interavl;
      const yPoint = TOP_PADDING + chartHeight - value / MAX_VALUE * chartHeight;
      // 출력 부분 설정
      ctx.fillText(value, Y_AXIS_PADDING - 3, yPoint);
    }

    // x축 선(line) 그리기
    ctx.lineTo(canvasWidth, chartHeight + TOP_PADDING);
    ctx.stroke();

    // 차트 범위 외 자르기
    ctx.save(); // 저장
    ctx.beginPath(); // 그리기
    ctx.rect(Y_AXIS_PADDING, 0, chartWidth, canvasWidth);
    ctx.clip(); // 자르기

    let currentTime = this.startTime - this.startTime % this.xTimeInterval;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    while (currentTime < this.endTime + this.xTimeInterval) {
      const xPoint = (currentTime - this.startTime) / DURATION * chartWidth;
      const date = new Date(currentTime);
      const text = date.getMinutes() + ':' + date.getSeconds();

      ctx.fillText(text, xPoint, chartHeight + TOP_PADDING + 4);
      currentTime += this.xTimeInterval;
    }

    /**
     * drawData
     */
    const barWidth = (1000 / DURATION * this.chartWidth) * 0.6;

    ctx.lineWidth = 2;

    this.data.forEach((data, i) => {
      ctx.beginPath(); // 그리기 시작
      data.forEach((datum, index) => {
        const [time, value] = datum;
        const xPoint = Y_AXIS_PADDING + (time - this.startTime) / DURATION * this.chartWidth;
        // TOP_PADDING 추가해서 y축 높이 설정합니다.
        const yPoint = TOP_PADDING + this.chartHeight - value / MAX_VALUE * this.chartHeight;

        // Chart style
        switch (i) {
          case 0: // Bar Chart
            // bar line
            // ctx.moveTo(xPoint, yPoint);
            // ctx.lineTo(xPoint, this.chartHeight + TOP_PADDING);

            // bar box
            ctx.rect(xPoint - barWidth/2, yPoint, barWidth, TOP_PADDING + this.chartHeight - yPoint);
            break;
          case 1:
            if (!index) {
              ctx.moveTo(xPoint, yPoint);
            } else {
              ctx.lineTo(xPoint, yPoint);
            }
            break;
        }
      })

      // line color add
      switch (i) {
        case 0:
          // ctx.strokeStyle = 'red';

          ctx.fillStyle = 'royalBlue';
          ctx.fill();
          break;
        case 1:
          ctx.strokeStyle = 'red';
          ctx.stroke();
          break;
      }

      ctx.stroke();
    })

    ctx.restore();
    // 애니메이션 효과 추가.
    window.requestAnimationFrame(this.drawChart);
  }

  /**
   * 데이터 갱신 함수
   */
  updateData = (data) => {
    data.forEach((datum, i) => {
      if (!Array.isArray(this.data[i])) this.data[i] = []; // 빈값 초기화
      this.data[i].push(datum);
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const chart = new LineChart('lineChart');

  // 1초마다 데이터 갱신
  window.setInterval(() => {
    chart.updateData([
      [Date.now(), Math.random() * 100],
      [Date.now(), Math.random() * 100]
    ]);
  }, 1000)
})