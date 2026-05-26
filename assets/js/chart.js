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
      textColor: "#ffffff",
      attributionLogo: false
    },

    grid: {
      vertLines: { color: "#1e293b"},
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
        labelVisible: true,
        labelBackgroundColor: "#240127"
      },
      horzLine: {
        labelVisible: true,
        labelBackgroundColor: "#facc15"
      }
    },
    
    width: container.clientWidth,
    height: 400
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
      priceScaleId: "right",
      priceFormat: {
        type: "price",
        precision: 8,
        minMove: 0.00000001
        
      },

      autoscaleInfoProvider: original => {

        const res = original();

        if (!res) return null;

        
        res.priceRange.minValue = 0;

        return res;
      }
    }  
  );

chart.priceScale("right").applyOptions({
  scaleMargins: {
    top: 0.3,
    bottom: 0
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
      priceScaleId: "left"
    }
  );

chart.priceScale("left").applyOptions({
  scaleMargins: {
    top: 0.8,
    bottom: 0
  }
});

chart.applyOptions({

  rightPriceScale: {
    visible: true,
    borderVisible: false
  },

  leftPriceScale: {
    visible: true,
    borderVisible: false
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
      priceLineVisible: true
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
    "O: " +  Number(candle.open).toFixed(16);

  document.getElementById("info-high").innerText =
    "H: " +  Number(candle.high).toFixed(16);

  document.getElementById("info-low").innerText =
    "L: " +  Number(candle.low).toFixed(16);

  document.getElementById("info-close").innerText =
    "C: " +  Number(candle.close).toFixed(16);

  document.getElementById("info-volume").innerText =
    "V: " + (
      param.seriesData.get(volumeSeries)?.value ?? 0
    );

});