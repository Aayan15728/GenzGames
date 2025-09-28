document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('draw-canvas');
    const ctx = canvas.getContext('2d');
    const resultDiv = document.getElementById('result');
    const scoreElement = document.getElementById('score');
    const feedbackElement = document.getElementById('feedback');
    const drawAgainBtn = document.getElementById('draw-again-btn');
    const clearBtn = document.getElementById('clear-btn');
    const highScoreElement = document.getElementById('high-score');

    // Add a visualization canvas for the target circle
    const vizCanvas = document.createElement('canvas');
    vizCanvas.width = canvas.width;
    vizCanvas.height = canvas.height;
    vizCanvas.style.position = 'absolute';
    vizCanvas.style.top = '0';
    vizCanvas.style.left = '0';
    vizCanvas.style.pointerEvents = 'none';
    canvas.parentElement.appendChild(vizCanvas);
    const vizCtx = vizCanvas.getContext('2d');

    let isDrawing = false;
    let points = [];
    let highScore = localStorage.getItem('circleHighScore') || 0;
    let targetCircle = { x: canvas.width / 2, y: canvas.height / 2, radius: 150 };
    // let currentLevel = 1; // Start at level 1 - Removed as per user request

    function updateHighScoreDisplay() {
        highScoreElement.textContent = `${parseFloat(highScore).toFixed(2)}%`;
    }

    // New function to draw the real-time calculated center
    function drawRealtimeCenter(center) {
        vizCtx.clearRect(0, 0, vizCanvas.width, vizCanvas.height); // Clear previous center
        vizCtx.fillStyle = 'rgba(0, 123, 255, 0.7)'; // Blue dot for center
        vizCtx.beginPath();
        vizCtx.arc(center.x, center.y, 5, 0, 2 * Math.PI);
        vizCtx.fill();
    }

    function drawTargetCircle() {
        vizCtx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);
        // vizCtx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        // vizCtx.lineWidth = 2;
        // vizCtx.beginPath();
        // vizCtx.arc(targetCircle.x, targetCircle.y, targetCircle.radius, 0, 2 * Math.PI);
        // vizCtx.stroke();
    }

    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        points = [{ x: e.clientX - rect.left, y: e.clientY - rect.top }];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#333';
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        points.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();

        // Real-time score update
        const realTimeScoreElement = document.getElementById('real-time-score');
        if (points.length > 5) {
            const tempEllipseFit = ellipseFit(points);
            if (tempEllipseFit && tempEllipseFit.eccentricity !== undefined) {
                const realTimeEccentricityPenalty = 30 * tempEllipseFit.eccentricity;
                let currentRealTimeScore = Math.max(0, 100 - realTimeEccentricityPenalty);
                realTimeScoreElement.textContent = `Real-time: ${currentRealTimeScore.toFixed(2)}%`;
                realTimeScoreElement.classList.remove('hidden');
            } else {
                realTimeScoreElement.classList.add('hidden');
            }
        } else {
            realTimeScoreElement.classList.add('hidden');
        }
    }

    function stopDrawing() {
        if (!isDrawing) return;
        isDrawing = false;
        analyzeCircle();
    }

    // --- NCAD Algorithm Implementation ---

    // Placeholder for a proper ellipse fitting algorithm.
    // A full implementation is complex and would require a library or extensive code.
    // This mock will return a fixed eccentricity for demonstration.
    function ellipseFit(points) {
        // More robust ellipse fitting (simplified for browser performance)
        // This attempts to find the major and minor axes more accurately than just bounding box
        if (points.length < 5) return { eccentricity: 1 }; // Need at least 5 points for a robust ellipse fit

        let sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0, sumXY = 0;
        points.forEach(p => {
            sumX += p.x;
            sumY += p.y;
            sumX2 += p.x * p.x;
            sumY2 += p.y * p.y;
            sumXY += p.x * p.y;
        });

        const N = points.length;
        const C1 = N * sumX2 - sumX * sumX;
        const C2 = N * sumXY - sumX * sumY;
        const C3 = N * sumY2 - sumY * sumY;

        // Coefficients for the quadratic equation A*lambda^2 + B*lambda + C = 0
        const A = 1;
        const B = -(C1 + C3) / N;
        const C = (C1 * C3 - C2 * C2) / (N * N);

        // Solve for eigenvalues (which relate to major/minor axes squared)
        const sqrtDiscriminant = Math.sqrt(B * B - 4 * A * C);
        const lambda1 = (-B + sqrtDiscriminant) / (2 * A);
        const lambda2 = (-B - sqrtDiscriminant) / (2 * A);

        // Ensure lambda1 >= lambda2
        const majorAxisSq = Math.max(lambda1, lambda2);
        const minorAxisSq = Math.min(lambda1, lambda2);

        if (minorAxisSq <= 0 || majorAxisSq <= 0) return { eccentricity: 1 }; // Degenerate case

        const eccentricity = Math.sqrt(1 - minorAxisSq / majorAxisSq);
        return { eccentricity: eccentricity };
    }

    function circleFit(points) {
        const n = points.length;
        if (n < 3) return null;
        let sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0, sumX3 = 0, sumY3 = 0, sumXY = 0, sumX1Y2 = 0, sumX2Y1 = 0;
        for (const p of points) {
            const x = p.x, y = p.y, x2 = x * x, y2 = y * y;
            sumX += x; sumY += y; sumX2 += x2; sumY2 += y2; sumX3 += x2 * x; sumY3 += y2 * y;
            sumXY += x * y; sumX1Y2 += x * y2; sumX2Y1 += x2 * y;
        }
        const A = n * sumX2 - sumX * sumX, B = n * sumXY - sumX * sumY, C = n * sumY2 - sumY * sumY;
        const D = 0.5 * (n * sumX1Y2 - sumX * sumY2 + n * sumX3 - sumX * sumX2);
        const E = 0.5 * (n * sumX2Y1 - sumX * sumX2 + n * sumY3 - sumY * sumY2);
        const det = A * C - B * B;
        if (Math.abs(det) < 1e-10) return null;
        const centerX = (D * C - B * E) / det, centerY = (A * E - B * D) / det;
        const radius = Math.sqrt((sumX2 - 2 * sumX * centerX + n * centerX * centerX + sumY2 - 2 * sumY * centerY + n * centerY * centerY) / n);
        return { x: centerX, y: centerY, radius: radius };
    }

    function calculateCurvature(points) {
        const curvatures = [];
        for (let i = 1; i < points.length - 1; i++) {
            const p1 = points[i - 1], p2 = points[i], p3 = points[i + 1];
            const a = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
            const b = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));
            const c = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2));
            const area = 0.5 * Math.abs(p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
            const R = (a * b * c) / (4 * area);
            if (R > 0) curvatures.push(1 / R);
        }
        return curvatures;
    }

    function analyzeCircle() {
        if (points.length < 20) {
            showResult(0, "Too short! Draw a full circle. ✍️");
            return;
        }

        const cFit = circleFit(points);
        if (!cFit || cFit.radius < 15) {
            showResult(2, "Is that a line or a scribble? 🤔");
            return;
        }

        // 1. Area Penalty
        const areaBF = Math.PI * cFit.radius * cFit.radius;
        const areaTarget = Math.PI * targetCircle.radius * targetCircle.radius;
        const pArea = (10 * Math.abs(areaBF - areaTarget) / areaTarget) * 2;

        // 2. Eccentricity Penalty (from 0 to 1, 0 is perfect circle)
        const eFit = ellipseFit(points);
        const pEccentricity = 30 * eFit.eccentricity; // Increased penalty for eccentricity

        // 3. Center-point Drift Penalty
        const centerDrift = Math.sqrt(
            Math.pow(cFit.x - targetCircle.x, 2) +
            Math.pow(cFit.y - targetCircle.y, 2)
        );
        const pCenterDrift = 20 * (centerDrift / targetCircle.radius); // Penalty based on drift relative to radius

        // 4. Line Jitter Penalty (using standard deviation of curvature)
        const curvatures = calculateCurvature(points);
        const meanCurvature = curvatures.reduce((a, b) => a + b, 0) / curvatures.length;
        const stdDevCurvature = Math.sqrt(curvatures.map(k => Math.pow(k - meanCurvature, 2)).reduce((a, b) => a + b, 0) / curvatures.length);
        const pJitter = 25 * (stdDevCurvature / (meanCurvature || 1)); // Penalty for inconsistent curvature

        // 5. Worst-Case Failure Trigger (angular extent)
        let angularExtentPenalty = 0;
        const center = { x: cFit.x, y: cFit.y };
        const startAngle = Math.atan2(points[0].y - center.y, points[0].x - center.x);
        const endAngle = Math.atan2(points[points.length - 1].y - center.y, points[points.length - 1].x - center.x);
        let angularExtent = Math.abs(endAngle - startAngle);
        if (angularExtent > Math.PI) angularExtent = 2 * Math.PI - angularExtent;
        if (angularExtent < 4.71) { // Less than 270 degrees
            angularExtentPenalty = 15;
        }

        let finalScore = Math.max(0, 100 - pArea - pEccentricity - pCenterDrift - pJitter - angularExtentPenalty);

        let feedback = "Good try!";
        if (finalScore >= 99.0) {
            feedback = "Absolutely perfect! 🤯"; // Removed "Next Level!" as per user request
            // currentLevel++; // Removed as per user request
            // targetCircle.radius = targetCircle.radius * Math.pow(1.15, 2); // Adaptive difficulty - Removed as per user request
            // drawTargetCircle(); // Redraw target circle with new radius - Removed as per user request
        } else if (finalScore > 90) feedback = "Almost a perfect circle! 🔵";
        else if (finalScore > 80) feedback = "Very well done! 👍";
        else if (finalScore > 70) feedback = "A solid attempt! 🙂";
        else feedback = "Keep practicing! You'll get it. 💪";

        const worldwideRating = 100 - (100 - finalScore) * (Math.random() * 0.2 + 0.8);
        document.getElementById('worldwide-rating').textContent = `You beat ${worldwideRating.toFixed(2)}% of people in the world!`;

        showResult(finalScore, feedback);

        if (finalScore > highScore) {
            highScore = finalScore;
            localStorage.setItem('circleHighScore', highScore);
            updateHighScoreDisplay();
        }
    }

    function showResult(score, feedback) {
        scoreElement.textContent = `${score.toFixed(2)}%`;
        feedbackElement.textContent = feedback;
        resultDiv.classList.remove('hidden');
        canvas.classList.add('hidden');
        vizCanvas.classList.add('hidden');
        document.getElementById('real-time-score').classList.add('hidden'); // Hide real-time score on result display
    }

    function resetGame() {
        resultDiv.classList.add('hidden');
        canvas.classList.remove('hidden');
        vizCanvas.classList.remove('hidden');
        document.getElementById('real-time-score').classList.add('hidden'); // Ensure real-time score is hidden on reset
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points = [];
        drawTargetCircle();
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e.touches[0]); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e.touches[0]); }, { passive: false });
    canvas.addEventListener('touchend', (e) => { e.preventDefault(); stopDrawing(); }, { passive: false });

    drawAgainBtn.addEventListener('click', resetGame);
    clearBtn.addEventListener('click', resetGame);

    updateHighScoreDisplay();
    drawTargetCircle();
});
