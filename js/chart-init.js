/* =========================================
   Sentient News — chart.js
   Interactive chart for the demo article
   (uses Chart.js loaded from CDN)
   ========================================= */

(function () {
  'use strict';

  // ── Data sets ─────────────────────────────────────────────────────────────
  const DATA = {
    investment: {
      label: 'AI Investment',
      labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
      datasets: [
        {
          label: 'Global AI Investment (USD billions)',
          data: [15.2, 24.6, 37.4, 47.9, 93.5, 91.9, 103.7, 131.5],
          borderColor: '#4f8ef7',
          backgroundColor: 'rgba(79, 142, 247, 0.12)',
          pointBackgroundColor: '#4f8ef7',
          tension: 0.4,
          fill: true,
        },
      ],
      yLabel: 'USD Billions',
    },
    parameters: {
      label: 'Model Size',
      labels: ['GPT-2\n(2019)', 'GPT-3\n(2020)', 'Gopher\n(2021)', 'PaLM\n(2022)', 'GPT-4\n(2023)', 'Gemini\nUltra\n(2023)', 'LLaMA 3\n(2024)'],
      datasets: [
        {
          label: 'Model Parameters (billions)',
          data: [1.5, 175, 280, 540, 1000, 1000, 405],
          borderColor: '#7c5cf6',
          backgroundColor: 'rgba(124, 92, 246, 0.12)',
          pointBackgroundColor: '#7c5cf6',
          tension: 0.4,
          fill: true,
        },
      ],
      yLabel: 'Billions of Parameters',
    },
    adoption: {
      label: 'Enterprise Adoption',
      labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
      datasets: [
        {
          label: 'Companies using AI (%)',
          data: [20, 25, 31, 41, 50, 55, 72],
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.12)',
          pointBackgroundColor: '#34d399',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Companies piloting AI (%)',
          data: [27, 32, 38, 25, 27, 29, 16],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          pointBackgroundColor: '#f59e0b',
          tension: 0.4,
          fill: true,
          borderDash: [6, 3],
        },
      ],
      yLabel: 'Percentage of Enterprises',
    },
  };

  // ── Chart defaults ─────────────────────────────────────────────────────────
  const CHART_DEFAULTS = {
    font: {
      family: "'Inter', system-ui, sans-serif",
      size: 12,
    },
    color: '#8899b4',
  };

  // ── Init ────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('aiChart');
    if (!canvas) return;

    // Apply global defaults
    if (window.Chart) {
      Chart.defaults.font.family = CHART_DEFAULTS.font.family;
      Chart.defaults.font.size   = CHART_DEFAULTS.font.size;
      Chart.defaults.color       = CHART_DEFAULTS.color;
    }

    let activeDataset = 'investment';
    let chartInstance = null;

    // Build the chart
    function buildChart(dataKey) {
      if (chartInstance) chartInstance.destroy();

      const config = DATA[dataKey];
      const ctx    = canvas.getContext('2d');

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: config.labels,
          datasets: config.datasets.map(ds => ({
            ...ds,
            pointRadius: 5,
            pointHoverRadius: 8,
            borderWidth: 2.5,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 600,
            easing: 'easeInOutQuart',
          },
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              display: config.datasets.length > 1,
              position: 'top',
              labels: {
                usePointStyle: true,
                pointStyleWidth: 10,
                boxHeight: 8,
                padding: 20,
                color: '#8899b4',
              },
            },
            tooltip: {
              backgroundColor: '#111827',
              borderColor: '#1f2d45',
              borderWidth: 1,
              padding: 14,
              titleColor: '#f0f6ff',
              bodyColor: '#8899b4',
              cornerRadius: 8,
              callbacks: {
                label: context => {
                  const val = context.parsed.y;
                  return ` ${context.dataset.label}: ${
                    dataKey === 'adoption' ? val + '%' :
                    dataKey === 'investment' ? '$' + val + 'B' :
                    val + 'B params'
                  }`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: { color: 'rgba(31, 45, 69, 0.6)', drawBorder: false },
              ticks: { maxRotation: 0 },
            },
            y: {
              grid: { color: 'rgba(31, 45, 69, 0.6)', drawBorder: false },
              title: {
                display: true,
                text: config.yLabel,
                color: '#4a5568',
                font: { size: 11 },
              },
              ticks: {
                callback: value => {
                  if (dataKey === 'adoption')  return value + '%';
                  if (dataKey === 'investment') return '$' + value + 'B';
                  return value >= 1000 ? (value / 1000).toFixed(1) + 'T' : value + 'B';
                },
              },
            },
          },
        },
      });
    }

    // Tab switching
    document.querySelectorAll('.chart-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.chart;
        if (!DATA[key] || key === activeDataset) return;

        document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        activeDataset = key;
        buildChart(key);

        // Update legend
        updateLegend(key);
      });
    });

    function updateLegend(key) {
      const footer = document.querySelector('.chart-footer');
      if (!footer) return;
      footer.innerHTML = DATA[key].datasets.map(ds => `
        <span class="chart-legend-item">
          <span class="chart-legend-dot" style="background:${ds.borderColor}"></span>
          ${ds.label}
        </span>
      `).join('');
    }

    // Initial render
    buildChart(activeDataset);
    updateLegend(activeDataset);
  });
})();
