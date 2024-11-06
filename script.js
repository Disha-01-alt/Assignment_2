document.getElementById('val').addEventListener('input', function () {
    const order = parseInt(document.getElementById('val').value);
    const errorDiv = document.getElementById('error');
    const matrixContainer = document.getElementById('input-matrix-container');
    const resultsDiv = document.getElementById('results');

    errorDiv.textContent = '';
    matrixContainer.innerHTML = '';
    resultsDiv.innerHTML = '';

    if (isNaN(order) || order < 1) {
        errorDiv.textContent = 'Please enter a valid positive integer.';
        return;
    }

    const matrix = [];
    for (let i = 0; i < order; i++) {
        const row = [];
        for (let j = 0; j < order; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-input';
            input.dataset.row = i;
            input.dataset.col = j;
            matrixContainer.appendChild(input);
            row.push(input);
        }
        matrix.push(row);
        matrixContainer.appendChild(document.createElement('br'));
    }
    
    const factorButton = document.createElement('button');
    factorButton.textContent = 'Calculate LDU Factorization';
    factorButton.addEventListener('click', function () {
        const numericMatrix = matrix.map(row => row.map(input => parseFloat(input.value) || 0));
        const { eliminationMatrices, L_steps, U, D } = LDUFactorization(numericMatrix);
        displayResults(eliminationMatrices, L_steps, U, D, numericMatrix);
    });

    matrixContainer.appendChild(factorButton);
});

