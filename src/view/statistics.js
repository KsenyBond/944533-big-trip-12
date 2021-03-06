import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import SmartView from "./smart.js";
import {divideCostsByTypes, divideByTransportTypes, divideDurationsByTypes} from "../utils/statistics.js";

const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx, events) => {
  const prices = new Map(divideCostsByTypes(events));
  moneyCtx.height = BAR_HEIGHT * prices.size;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [...prices.keys()].map((typeToFormat) => typeToFormat[0].toUpperCase() + typeToFormat.slice(1)),
      datasets: [{
        data: [...prices.values()],
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        minBarLength: 50
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderChart = (canvasCtx, events, title, label) => {
  canvasCtx.height = BAR_HEIGHT * events.size;

  return new Chart(canvasCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [...events.keys()].map((typeToFormat) => typeToFormat[0].toUpperCase() + typeToFormat.slice(1)),
      datasets: [{
        data: [...events.values()],
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        minBarLength: 50
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}${label}`
        }
      },
      title: {
        display: true,
        text: title,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {

  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends SmartView {
  constructor(events) {
    super();

    this._events = events;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  get template() {
    return createStatisticsTemplate();
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._transportChart !== null || this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._transportChart = null;
      this._timeSpendChart = null;
    }
  }

  _setCharts() {
    if (this._moneyChart !== null || this._transportChart !== null || this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._transportChart = null;
      this._timeSpendChart = null;
    }

    const moneyCtx = this.element.querySelector(`.statistics__chart--money`);
    const transportCtx = this.element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.element.querySelector(`.statistics__chart--time`);

    const transportTypes = new Map(divideByTransportTypes(this._events));
    const durations = new Map(divideDurationsByTypes(this._events));

    this._moneyChart = renderMoneyChart(moneyCtx, this._events);
    this._transportChart = renderChart(transportCtx, transportTypes, `TRANSPORT`, `x`);
    this._timeSpendChart = renderChart(timeSpendCtx, durations, `TIME SPENT`, `H`);
  }
}
