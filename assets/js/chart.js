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

    width: container.clientWidth,
    height: 400
  });

// -----------------------------------
// CANDLE SERIES (v5 CORRECT)
// -----------------------------------

const candleSeries =
  chart.addSeries(
    LightweightCharts.CandlestickSeries,
    {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444"
    }
  );

// -----------------------------------
// 🟡 LÍNEA DE LIQUIDEZ (AÑADIDO)
// -----------------------------------

const lastPriceSeries =
  chart.addSeries(
    LightweightCharts.LineSeries,
    {
      color: "#facc15",
      lineWidth: 2,
      priceLineVisible: false
    }
  );

// -----------------------------------
// RESPONSIVE (REAL FIX)
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