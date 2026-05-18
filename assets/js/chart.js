// -----------------------------------
// CHART CONTAINER
// -----------------------------------
const container =
  document.getElementById("chart");

// -----------------------------------
// CREATE CHART (v5)
// -----------------------------------
const chart =
  LightweightCharts.createChart(container, {

    layout: {
      background: { color: "#0f172a" },
      textColor: "#ffffff"
    },

    grid: {
      vertLines: { color: "#1e293b" },
      horzLines: { color: "#1e293b" }
    },

    timeScale: {
      barSpacing: 40,
      timeVisible: true,
      secondsVisible: true
    },

    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
      vertLine: {
        labelVisible: true
      },
      horzLine: {
        labelVisible: true,
        labelBackgroundColor: "#facc15"
      }
    },

    width: container.clientWidth,
    height: 400
  });

chart.priceScale("").applyOptions({
  scaleMargins: {
    top: 0.8,
    bottom: 0
  }
});

// -----------------------------------
// CANDLE SERIES
// -----------------------------------
const candleSeries =
  chart.addSeries(
    LightweightCharts.CandlestickSeries,
    {
      upColor: "#20bd5a77",
      downColor: "#ef444481",
      borderVisible: true,
      wickUpColor: "#00ff15",
      wickDownColor: "#ff1111",
      priceScaleId: "right"
    }
  );

chart.priceScale("right").applyOptions({
  scaleMargins: {
    top: 0.2,
    bottom: 0.3
  }
});


// -----------------------------------
//  VOLUME SERIES
// -----------------------------------
const volumeSeries =
  chart.addSeries(
    LightweightCharts.HistogramSeries,
    {
      priceFormat: {
        type: "volume"
      },
      priceScaleId: ""
    }
  );

chart.priceScale("").applyOptions({
  scaleMargins: {
    top: 0.8,
    bottom: 0
  }
});


// -----------------------------------
// LÍNEA DE LAST PRICE
// -----------------------------------
const lastPriceSeries =
  chart.addSeries(
    LightweightCharts.LineSeries,
    {
      color: "#fbff00",
      lineWidth: 1,
      priceLineVisible: false
    }
  );


// -----------------------------------
// RESPONSIVE
// -----------------------------------
const resizeObserver =
  new ResizeObserver(entries => {

    const { width } =
      entries[0].contentRect;

    chart.applyOptions({
      width
    });

  });

resizeObserver.observe(container);

chart.subscribeCrosshairMove(param => {

  const candle =
    param.seriesData.get(candleSeries);

  if (!candle) return;

  document.getElementById("info-open").innerText =
    "Open: " + candle.open;

  document.getElementById("info-high").innerText =
    "High: " + candle.high;

  document.getElementById("info-low").innerText =
    "Low: " + candle.low;

  document.getElementById("info-close").innerText =
    "Close: " + candle.close;

  document.getElementById("info-volume").innerText =
    "Volume: " + (
      param.seriesData.get(volumeSeries)?.value ?? 0
    );

});