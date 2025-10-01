function sellSellSellGame(container) {
    let cash = 10000;
    let shares = 0;
    let price = 50;
    const priceHistory = Array(150).fill(price);
    let gameInterval;

    container.innerHTML = `
        <div style="display: grid; grid-template-columns: 3fr 1fr; gap: 2rem; align-items: start;">
            <div class="chart-container">
                <canvas id="stock-chart" style="width:100%; height:400px;"></canvas>
            </div>
            <div id="trading-panel">
                <div class="price-box">
                    <p class="label">Stock Price</p>
                    <h3 id="current-price" class="price-value"></h3>
                </div>
                <div class="holdings-box">
                    <p class="label">Portfolio</p>
                    <p style="margin:0.25rem 0; font-size:1.2rem; font-weight:600;"><span id="shares-owned">0</span> Shares</p>
                    <p style="margin:0; font-size:1.2rem; font-weight:600; color:var(--primary-color);" id="cash-owned"></p>
                </div>
                <div style="display:flex; gap:1rem;">
                    <button id="buy-btn" class="button">Buy</button>
                    <button id="sell-btn" class="button secondary">Sell</button>
                </div>
            </div>
        </div>
    `;

    const canvas = container.querySelector('#stock-chart');
    const ctx = canvas.getContext('2d');

    const updateUI = () => {
        container.querySelector('#current-price').textContent = `$${price.toFixed(2)}`;
        container.querySelector('#shares-owned').textContent = shares;
        container.querySelector('#cash-owned').textContent = `$${cash.toFixed(2)}`;
        
        // Update button states
        const buyBtn = container.querySelector('#buy-btn');
        const sellBtn = container.querySelector('#sell-btn');
        
        buyBtn.disabled = cash < price;
        sellBtn.disabled = shares <= 0;
        
        buyBtn.style.opacity = buyBtn.disabled ? '0.6' : '1';
        sellBtn.style.opacity = sellBtn.disabled ? '0.6' : '1';
    };

    const drawChart = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const maxPrice = Math.max(...priceHistory) * 1.1;
        const minPrice = Math.min(...priceHistory) * 0.9;

        // Draw grid
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        for(let i = 0; i < 10; i++) {
            const y = (i / 9) * canvas.height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw price line
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - ((priceHistory[0] - minPrice) / (maxPrice - minPrice)) * canvas.height);
        priceHistory.forEach((p, i) => {
            const x = (i / (priceHistory.length - 1)) * canvas.width;
            const y = canvas.height - ((p - minPrice) / (maxPrice - minPrice)) * canvas.height;
            ctx.lineTo(x, y);
        });
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(1, '#ff6b6b80');
        
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Fill area under the line
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.fillStyle = 'rgba(255, 107, 107, 0.1)';
        ctx.fill();
    };

    const gameLoop = () => {
        // More realistic price movement
        const volatility = 0.08; // 8% volatility
        const change = price * volatility * (Math.random() - 0.5);
        price = Math.max(1, price + change);
        
        // Ensure smooth price movement
        price = Math.round(price * 100) / 100;
        
        priceHistory.push(price);
        priceHistory.shift();
        
        drawChart();
        updateUI();
    };

    container.querySelector('#buy-btn').onclick = () => {
        if (cash >= price) {
            cash -= price;
            shares++;
            updateUI();
            
            // Visual feedback
            const btn = container.querySelector('#buy-btn');
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = '', 100);
        }
    };

    container.querySelector('#sell-btn').onclick = () => {
        if (shares > 0) {
            cash += price;
            shares--;
            updateUI();
            
            // Visual feedback
            const btn = container.querySelector('#sell-btn');
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = '', 100);
        }
    };

    const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawChart();
    };

    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start game loop with smoother updates
    gameInterval = setInterval(gameLoop, 30);  // Update every 30ms for smoother animation

    return () => clearInterval(gameInterval);
}

sellSellSellGame(document.getElementById('sell-sell-sell-game'));
