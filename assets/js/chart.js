// ============================================================
//  chart.js  —  LibreSwapNet  (LightweightCharts v5)
//  Indicadores configurables: EMA A, EMA B, RSI, MACD
//  Timeframe selector + Pantalla completa
// ============================================================

const TIMEFRAMES = ["1m","5m","15m","30m","1h","4h","1d"];

const _urlParams = new URLSearchParams(window.location.search);
window._currentTF  = _urlParams.get("timeframe") ?? "4h";
const _currentPair = _urlParams.get("pair") ?? "ZTC_BTC";

// ── Estado de indicadores ────────────────────────────────────

const IND = {
  emaA: { period: 9,  enabled: false },
  emaB: { period: 21, enabled: false },
  rsi:  { period: 14, enabled: false },
  macd: { fast: 12, slow: 26, signal: 9, enabled: false }
};

// ── Helpers matemáticos ──────────────────────────────────────

function calcEMA(data, period) {
  if (data.length < period) return [];
  const k = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((s, b) => s + b.close, 0) / period;
  const result = [{ time: data[period - 1].time, value: ema }];
  for (let i = period; i < data.length; i++) {
    ema = data[i].close * k + ema * (1 - k);
    result.push({ time: data[i].time, value: ema });
  }
  return result;
}

function calcRSI(data, period) {
  if (data.length < period + 1) return [];
  let avgGain = 0, avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const d = data[i].close - data[i - 1].close;
    avgGain += (d > 0 ? d : 0) / period;
    avgLoss += (d < 0 ? -d : 0) / period;
  }
  const result = [];
  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  result.push({ time: data[period].time, value: 100 - 100 / (1 + rs) });
  for (let i = period + 1; i < data.length; i++) {
    const d = data[i].close - data[i - 1].close;
    avgGain = (avgGain * (period - 1) + (d > 0 ? d : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (d < 0 ? -d : 0)) / period;
    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push({ time: data[i].time, value: 100 - 100 / (1 + rs) });
  }
  return result;
}

function calcMACD(data, fast, slow, signal) {
  if (data.length < slow + signal) return { macd: [], signal: [], histogram: [] };
  const emaFast = calcEMA(data, fast);
  const emaSlow = calcEMA(data, slow);
  const slowMap = new Map(emaSlow.map(p => [p.time, p.value]));
  const macdLine = emaFast
    .filter(p => slowMap.has(p.time))
    .map(p => ({ time: p.time, value: p.value - slowMap.get(p.time) }));
  if (macdLine.length < signal) return { macd: [], signal: [], histogram: [] };
  const k = 2 / (signal + 1);
  let sig = macdLine.slice(0, signal).reduce((s, p) => s + p.value, 0) / signal;
  const signalLine = [{ time: macdLine[signal - 1].time, value: sig }];
  for (let i = signal; i < macdLine.length; i++) {
    sig = macdLine[i].value * k + sig * (1 - k);
    signalLine.push({ time: macdLine[i].time, value: sig });
  }
  const sigMap = new Map(signalLine.map(p => [p.time, p.value]));
  const histogram = macdLine
    .filter(p => sigMap.has(p.time))
    .map(p => ({
      time: p.time,
      value: p.value - sigMap.get(p.time),
      color: p.value - sigMap.get(p.time) >= 0 ? "#22c55e88" : "#ef444488"
    }));
  return { macd: macdLine, signal: signalLine, histogram };
}

function flatLine(refData, value) {
  return refData.map(p => ({ time: p.time, value }));
}

// ── Toolbar HTML ─────────────────────────────────────────────

const sectionGraph = document.querySelector(".section-graph-trading");

const toolbar = document.createElement("div");
toolbar.id = "chart-toolbar";
toolbar.innerHTML = `
  <div class="ct-section ct-tf-section">
    ${TIMEFRAMES.map(tf => `
      <button class="ct-tf ${tf === window._currentTF ? 'ct-tf-active' : ''}" data-tf="${tf}">${tf}</button>
    `).join("")}
  </div>
  <div class="ct-divider"></div>
  <div class="ct-section">
    <div class="ct-group">
      <button class="ct-pill" id="ct-emaA-toggle">EMA <span id="ct-emaA-label">${IND.emaA.period}</span></button>
      <input class="ct-input" id="ct-emaA-input" type="number" min="1" max="500" value="${IND.emaA.period}" title="Período EMA A">
    </div>
    <div class="ct-group">
      <button class="ct-pill" id="ct-emaB-toggle">EMA <span id="ct-emaB-label">${IND.emaB.period}</span></button>
      <input class="ct-input" id="ct-emaB-input" type="number" min="1" max="500" value="${IND.emaB.period}" title="Período EMA B">
    </div>
    <div class="ct-group">
      <button class="ct-pill" id="ct-rsi-toggle">RSI <span id="ct-rsi-label">${IND.rsi.period}</span></button>
      <input class="ct-input" id="ct-rsi-input" type="number" min="2" max="200" value="${IND.rsi.period}" title="Período RSI">
    </div>
    <div class="ct-group">
      <button class="ct-pill" id="ct-macd-toggle">MACD</button>
      <input class="ct-input" id="ct-macd-fast"   type="number" min="1" max="200" value="${IND.macd.fast}"   title="Rápida">
      <span class="ct-sep">/</span>
      <input class="ct-input" id="ct-macd-slow"   type="number" min="1" max="200" value="${IND.macd.slow}"   title="Lenta">
      <span class="ct-sep">/</span>
      <input class="ct-input" id="ct-macd-signal" type="number" min="1" max="200" value="${IND.macd.signal}" title="Señal">
    </div>
  </div>
  <div class="ct-spacer"></div>
  <button class="ct-fs-btn" id="ct-fullscreen" title="Pantalla completa">
    <svg id="ct-fs-icon-expand" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <svg id="ct-fs-icon-compress" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:none">
      <path d="M5 1V5H1M9 5V1M13 9H9V13M1 9H5V13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
`;

const chartEl = document.getElementById("chart");
sectionGraph.insertBefore(toolbar, chartEl);

// ── Estilos ───────────────────────────────────────────────────

const style = document.createElement("style");
style.textContent = `
  #chart-toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    padding: 5px 10px;
    background: #0b1220;
    border-bottom: 1px solid #1e293b;
    user-select: none;
  }
  .ct-spacer { flex: 1; }
  .ct-section { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
  .ct-tf-section { gap: 2px; }
  .ct-divider { width: 1px; height: 20px; background: #334155; margin: 0 4px; flex-shrink: 0; }
  .ct-group { display: flex; align-items: center; gap: 3px; }
  .ct-sep { color: #475569; font-size: 11px; }

  .ct-tf {
    padding: 3px 7px;
    border-radius: 4px;
    border: 1px solid transparent;
    background: transparent;
    color: #64748b;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all .15s;
  }
  .ct-tf:hover { color: #cbd5e1; background: #1e293b; }
  .ct-tf-active { background: #1e3a5f; border-color: #38bdf8; color: #e2e8f0; }

  .ct-pill {
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid #334155;
    background: #1e293b;
    color: #94a3b8;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all .15s;
    white-space: nowrap;
  }
  .ct-pill.ct-active { border-color: #38bdf8; color: #e2e8f0; background: #0f2236; }
  .ct-pill:hover { opacity: .85; }

  .ct-input {
    width: 38px;
    padding: 3px 4px;
    border-radius: 4px;
    border: 1px solid #334155;
    background: #0f172a;
    color: #e2e8f0;
    font-size: 11px;
    text-align: center;
    outline: none;
    -moz-appearance: textfield;
  }
  .ct-input::-webkit-inner-spin-button,
  .ct-input::-webkit-outer-spin-button { -webkit-appearance: none; }
  .ct-input:focus { border-color: #38bdf8; }

  /* Botón pantalla completa */
  .ct-fs-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border-radius: 4px;
    border: 1px solid #334155;
    background: #1e293b;
    color: #94a3b8;
    cursor: pointer;
    transition: all .15s;
    flex-shrink: 0;
  }
  .ct-fs-btn:hover { border-color: #38bdf8; color: #e2e8f0; background: #0f2236; }

  /* Contenedor en fullscreen */
  .ct-fullscreen-wrapper {
    position: fixed !important;
    inset: 0 !important;
    z-index: 9999 !important;
    background: #0b1220 !important;
    display: flex !important;
    flex-direction: column !important;
    border-radius: 0 !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden !important;
  }

  /* En fullscreen el toolbar no hace wrap */
  .ct-fullscreen-wrapper #chart-toolbar {
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  /* En fullscreen el chart crece */
  .ct-fullscreen-wrapper #chart {
    flex: 1;
    min-height: 0;
  }
  .ct-fullscreen-wrapper #chart-main {
    flex: 1 !important;
    height: auto !important;
    min-height: 0 !important;
  }

  /* Tecla ESC hint */
  .ct-esc-hint {
    position: fixed;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    background: rgba(15,23,42,0.85);
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 4px 12px;
    font-size: 11px;
    color: #94a3b8;
    pointer-events: none;
    animation: ct-hint-fade 3s forwards;
  }
  @keyframes ct-hint-fade {
    0%   { opacity: 1; }
    70%  { opacity: 1; }
    100% { opacity: 0; }
  }

  .tv-lightweight-charts a,
  a[href*="tradingview.com"] { display: none !important; }
`;
document.head.appendChild(style);

// ── DOM chart containers ─────────────────────────────────────

const container = document.getElementById("chart");
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.gap = "0";

const mainDiv = document.createElement("div");
mainDiv.id = "chart-main";
mainDiv.style.cssText = "width:100%; height:320px; position:relative;";

const rsiDiv = document.createElement("div");
rsiDiv.id = "chart-rsi";
rsiDiv.style.cssText = "width:100%; height:90px; border-top:1px solid #1e293b; display:none;";

const macdDiv = document.createElement("div");
macdDiv.id = "chart-macd";
macdDiv.style.cssText = "width:100%; height:90px; border-top:1px solid #1e293b; display:none;";

container.appendChild(mainDiv);
container.appendChild(rsiDiv);
container.appendChild(macdDiv);

// ── Opciones comunes ─────────────────────────────────────────

const commonOpts = {
  layout: { background: { color: "#0f172a" }, textColor: "#94a3b8" },
  grid: { vertLines: { color: "#1e293b" }, horzLines: { color: "#1e293b" } },
  timeScale: { barSpacing: 40, timeVisible: true, secondsVisible: true, borderColor: "#334155" },
  crosshair: {
    mode: LightweightCharts.CrosshairMode.Normal,
    vertLine: { labelVisible: true, color: "#64748b", style: 1 },
    horzLine: { labelVisible: true, labelBackgroundColor: "#facc15", color: "#64748b", style: 1 }
  }
};

function hideTVLogo() {
  setTimeout(() => {
    document.querySelectorAll('.tv-lightweight-charts a, a[href*="tradingview"]')
      .forEach(a => a.style.display = 'none');
  }, 400);
}

// ── Gráficos ─────────────────────────────────────────────────

const chart = LightweightCharts.createChart(mainDiv, {
  ...commonOpts, width: mainDiv.clientWidth, height: 320, watermark: { visible: false }
});
chart.priceScale("right").applyOptions({ scaleMargins: { top: 0.08, bottom: 0.25 }, borderColor: "#334155" });

const rsiChart = LightweightCharts.createChart(rsiDiv, {
  ...commonOpts, width: rsiDiv.clientWidth, height: 90,
  timeScale: { ...commonOpts.timeScale, visible: false }, watermark: { visible: false }
});
rsiChart.priceScale("right").applyOptions({ scaleMargins: { top: 0.1, bottom: 0.1 }, borderColor: "#334155" });

const macdChart = LightweightCharts.createChart(macdDiv, {
  ...commonOpts, width: macdDiv.clientWidth, height: 90,
  timeScale: { ...commonOpts.timeScale, visible: false }, watermark: { visible: false }
});
macdChart.priceScale("right").applyOptions({ scaleMargins: { top: 0.1, bottom: 0.1 }, borderColor: "#334155" });

hideTVLogo();

// ── Series ───────────────────────────────────────────────────

const candleSeries = chart.addSeries(LightweightCharts.CandlestickSeries, {
  upColor: "#22c55e", downColor: "#ef4444",
  borderUpColor: "#22c55e", borderDownColor: "#ef4444",
  wickUpColor: "#22c55e", wickDownColor: "#ef4444",
  priceScaleId: "right",
  priceFormat: { type: "price", precision: 10, minMove: 0.0000000001 }
});

const volumeSeries = chart.addSeries(LightweightCharts.HistogramSeries, {
  priceFormat: { type: "volume" }, priceScaleId: "vol",
  lastValueVisible: false, priceLineVisible: false
});
chart.priceScale("vol").applyOptions({ visible: false, scaleMargins: { top: 0.75, bottom: 0 } });

const emaASeries = chart.addSeries(LightweightCharts.LineSeries, {
  color: "#38bdf8", lineWidth: 1, priceLineVisible: false,
  lastValueVisible: true, title: `EMA ${IND.emaA.period}`, priceScaleId: "right", visible: false
});
const emaBSeries = chart.addSeries(LightweightCharts.LineSeries, {
  color: "#f97316", lineWidth: 1, priceLineVisible: false,
  lastValueVisible: true, title: `EMA ${IND.emaB.period}`, priceScaleId: "right", visible: false
});

const rsiSeries = rsiChart.addSeries(LightweightCharts.LineSeries, {
  color: "#e879f9", lineWidth: 1, priceLineVisible: false,
  lastValueVisible: true, title: `RSI ${IND.rsi.period}`, priceScaleId: "right"
});
const rsi70Series = rsiChart.addSeries(LightweightCharts.LineSeries, {
  color: "#ef444466", lineWidth: 1, lineStyle: 2, priceLineVisible: false, lastValueVisible: false, priceScaleId: "right"
});
const rsi30Series = rsiChart.addSeries(LightweightCharts.LineSeries, {
  color: "#22c55e66", lineWidth: 1, lineStyle: 2, priceLineVisible: false, lastValueVisible: false, priceScaleId: "right"
});

const macdLineSeries = macdChart.addSeries(LightweightCharts.LineSeries, {
  color: "#38bdf8", lineWidth: 1, priceLineVisible: false, lastValueVisible: true, title: "MACD", priceScaleId: "right"
});
const macdSignalSeries = macdChart.addSeries(LightweightCharts.LineSeries, {
  color: "#f97316", lineWidth: 1, priceLineVisible: false, lastValueVisible: true, title: "Signal", priceScaleId: "right"
});
const macdHistSeries = macdChart.addSeries(LightweightCharts.HistogramSeries, {
  priceScaleId: "right", lastValueVisible: false, priceLineVisible: false
});

// ── Datos en memoria ──────────────────────────────────────────

let _lastCandles = [];

// ── Resize de todos los paneles ───────────────────────────────

function resizeAllCharts() {
  const w = container.clientWidth;
  chart.applyOptions({ width: w });
  if (rsiDiv.style.display !== "none") rsiChart.applyOptions({ width: w });
  if (macdDiv.style.display !== "none") macdChart.applyOptions({ width: w });

  // En fullscreen: altura dinámica para el panel principal
  if (sectionGraph.classList.contains("ct-fullscreen-wrapper")) {
    const toolbarH = toolbar.offsetHeight;
    const rsiH     = rsiDiv.style.display  !== "none" ? 90 : 0;
    const macdH    = macdDiv.style.display !== "none" ? 90 : 0;
    const mainH    = window.innerHeight - toolbarH - rsiH - macdH;
    chart.applyOptions({ height: Math.max(200, mainH) });
  } else {
    chart.applyOptions({ height: 320 });
  }
}

function showPanel(div, chartInst) {
  div.style.display = "block";
  requestAnimationFrame(() => {
    chartInst.applyOptions({ width: container.clientWidth });
    resizeAllCharts();
  });
}

// ── Renderizado de indicadores ────────────────────────────────

function renderIndicators() {
  const data = _lastCandles;
  if (!data.length) return;

  if (IND.emaA.enabled && data.length >= IND.emaA.period) {
    emaASeries.setData(calcEMA(data, IND.emaA.period));
    emaASeries.applyOptions({ visible: true, title: `EMA ${IND.emaA.period}` });
  } else {
    emaASeries.setData([]); emaASeries.applyOptions({ visible: false });
  }

  if (IND.emaB.enabled && data.length >= IND.emaB.period) {
    emaBSeries.setData(calcEMA(data, IND.emaB.period));
    emaBSeries.applyOptions({ visible: true, title: `EMA ${IND.emaB.period}` });
  } else {
    emaBSeries.setData([]); emaBSeries.applyOptions({ visible: false });
  }

  if (IND.rsi.enabled && data.length >= IND.rsi.period + 1) {
    const rsiData = calcRSI(data, IND.rsi.period);
    rsiSeries.setData(rsiData);
    rsiSeries.applyOptions({ visible: true, title: `RSI ${IND.rsi.period}` });
    rsi70Series.setData(flatLine(rsiData, 70));
    rsi30Series.setData(flatLine(rsiData, 30));
    showPanel(rsiDiv, rsiChart);
  } else {
    rsiSeries.setData([]); rsi70Series.setData([]); rsi30Series.setData([]);
    rsiDiv.style.display = "none";
    resizeAllCharts();
  }

  if (IND.macd.enabled && data.length >= IND.macd.slow + IND.macd.signal) {
    const { macd, signal, histogram } = calcMACD(data, IND.macd.fast, IND.macd.slow, IND.macd.signal);
    macdLineSeries.setData(macd);
    macdSignalSeries.setData(signal);
    macdHistSeries.setData(histogram);
    showPanel(macdDiv, macdChart);
  } else {
    macdLineSeries.setData([]); macdSignalSeries.setData([]); macdHistSeries.setData([]);
    macdDiv.style.display = "none";
    resizeAllCharts();
  }
}

// ── API pública ───────────────────────────────────────────────

window.setChartData = function (candles) {
  if (!candles || !candles.length) return;
  candles.sort((a, b) => a.time - b.time);
  _lastCandles = candles;
  candleSeries.setData(candles.map(c => ({
    time: c.time, open: c.open, high: c.high, low: c.low, close: c.close
  })));
  volumeSeries.setData(candles.map(c => ({
    time: c.time, value: c.volume,
    color: c.close >= c.open ? "#22c55e44" : "#ef444444"
  })));
  renderIndicators();
  hideTVLogo();
};

window.updateLastCandle = function (candle) {
  candleSeries.update({
    time: candle.time, open: candle.open, high: candle.high,
    low: candle.low, close: candle.close
  });
  volumeSeries.update({
    time: candle.time, value: candle.volume,
    color: candle.close >= candle.open ? "#22c55e44" : "#ef444444"
  });
};

// ── Pantalla completa ─────────────────────────────────────────

const fsBtn        = document.getElementById("ct-fullscreen");
const fsIconExpand   = document.getElementById("ct-fs-icon-expand");
const fsIconCompress = document.getElementById("ct-fs-icon-compress");
let _isFullscreen  = false;

function enterFullscreen() {
  _isFullscreen = true;
  sectionGraph.classList.add("ct-fullscreen-wrapper");
  fsIconExpand.style.display   = "none";
  fsIconCompress.style.display = "block";
  document.body.style.overflow = "hidden";

  // Hint ESC
  const hint = document.createElement("div");
  hint.className = "ct-esc-hint";
  hint.textContent = "Presiona ESC para salir de pantalla completa";
  document.body.appendChild(hint);
  setTimeout(() => hint.remove(), 3100);

  requestAnimationFrame(() => resizeAllCharts());
}

function exitFullscreen() {
  _isFullscreen = false;
  sectionGraph.classList.remove("ct-fullscreen-wrapper");
  fsIconExpand.style.display   = "block";
  fsIconCompress.style.display = "none";
  document.body.style.overflow = "";
  requestAnimationFrame(() => resizeAllCharts());
}

fsBtn.addEventListener("click", () => {
  _isFullscreen ? exitFullscreen() : enterFullscreen();
});

// ESC para salir
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && _isFullscreen) exitFullscreen();
});

// ── Timeframe buttons ─────────────────────────────────────────

toolbar.querySelectorAll(".ct-tf").forEach(btn => {
  btn.addEventListener("click", () => {
    window._currentTF = btn.dataset.tf;
    toolbar.querySelectorAll(".ct-tf").forEach(b => b.classList.remove("ct-tf-active"));
    btn.classList.add("ct-tf-active");
    const url = new URL(window.location.href);
    url.searchParams.set("timeframe", window._currentTF);
    window.history.replaceState({}, "", url);
    loadChart(_currentPair, window._currentTF);
  });
});

// ── Controles de indicadores ──────────────────────────────────

function bindControl(toggleId, inputId, indKey, labelId) {
  const toggle = document.getElementById(toggleId);
  const input  = document.getElementById(inputId);
  const label  = labelId ? document.getElementById(labelId) : null;
  toggle.addEventListener("click", () => {
    IND[indKey].enabled = !IND[indKey].enabled;
    toggle.classList.toggle("ct-active", IND[indKey].enabled);
    renderIndicators();
  });
  input.addEventListener("change", () => {
    const v = parseInt(input.value);
    if (!isNaN(v) && v >= 1) {
      IND[indKey].period = v;
      if (label) label.textContent = v;
      renderIndicators();
    }
  });
  input.addEventListener("keydown", e => { if (e.key === "Enter") input.dispatchEvent(new Event("change")); });
}

bindControl("ct-emaA-toggle", "ct-emaA-input", "emaA", "ct-emaA-label");
bindControl("ct-emaB-toggle", "ct-emaB-input", "emaB", "ct-emaB-label");
bindControl("ct-rsi-toggle",  "ct-rsi-input",  "rsi",  "ct-rsi-label");

document.getElementById("ct-macd-toggle").addEventListener("click", () => {
  IND.macd.enabled = !IND.macd.enabled;
  document.getElementById("ct-macd-toggle").classList.toggle("ct-active", IND.macd.enabled);
  renderIndicators();
});
["fast", "slow", "signal"].forEach(key => {
  const el = document.getElementById(`ct-macd-${key}`);
  const apply = () => {
    const v = parseInt(el.value);
    if (!isNaN(v) && v >= 1) { IND.macd[key] = v; renderIndicators(); }
  };
  el.addEventListener("change", apply);
  el.addEventListener("keydown", e => { if (e.key === "Enter") apply(); });
});

// ── Crosshair info-bar ────────────────────────────────────────

chart.subscribeCrosshairMove(param => {
  const candle = param.seriesData.get(candleSeries);
  if (!candle) return;
  document.getElementById("info-open").innerText  = "O: " + Number(candle.open).toFixed(8);
  document.getElementById("info-high").innerText  = "H: " + Number(candle.high).toFixed(8);
  document.getElementById("info-low").innerText   = "L: " + Number(candle.low).toFixed(8);
  document.getElementById("info-close").innerText = "C: " + Number(candle.close).toFixed(8);
  const vol = param.seriesData.get(volumeSeries);
  document.getElementById("info-volume").innerText = "V: " + (vol ? Number(vol.value).toLocaleString() : "0");
});

// ── Sync scroll/zoom ──────────────────────────────────────────

const allCharts = [chart, rsiChart, macdChart];
let syncing = false;
allCharts.forEach(src => {
  src.timeScale().subscribeVisibleLogicalRangeChange(range => {
    if (syncing || !range) return;
    syncing = true;
    allCharts.forEach(dst => { if (dst !== src) dst.timeScale().setVisibleLogicalRange(range); });
    syncing = false;
  });
});

// ── Responsive ────────────────────────────────────────────────

const resizeObserver = new ResizeObserver(() => resizeAllCharts());
resizeObserver.observe(container);
