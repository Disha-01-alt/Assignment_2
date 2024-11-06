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

function LDUFactorization(matrix) {
    const n = matrix.length;
    const L_steps = [];
    const eliminationMatrices = [];
    const U = JSON.parse(JSON.stringify(matrix));

    let L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const multiplier = U[j][i] / U[i][i];
            L[j][i] = multiplier;

            for (let k = i; k < n; k++) {
                U[j][k] -= multiplier * U[i][k];
                U[j][k] = parseFloat(U[j][k].toFixed(10)); // Control precision
            }

            let E = Array.from({ length: n }, (_, x) => Array.from({ length: n }, (_, y) => (x === y ? 1 : 0)));
            E[j][i] = -multiplier;
            eliminationMatrices.push({ E, step: `E${j+1}${i+1}` });
        }
        L_steps.push(JSON.parse(JSON.stringify(L)));
    }
    
    const D = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? U[i][i] : 0)));
    return { eliminationMatrices, L_steps, U, D };
}

function multiplyMatrices(A, B) {
    const n = A.length;
    const result = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
            result[i][j] = parseFloat(result[i][j].toFixed(10)); // Control precision in the result
        }
    }
    return result;
}

function displayResults(eliminationMatrices) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Results</h2><hr>';

    resultsDiv.innerHTML += '<h3>Elimination Matrices:</h3>';
    eliminationMatrices.forEach(({ E, step }) => {
        resultsDiv.innerHTML += `<h4>${step}:</h4>` + matrixToHtml(E);
    });

  resultsDiv.innerHTML += '<h3>Lower Triangular Matrix L (Step-by-Step Construction):</h3>';
    L_steps.forEach((L, index) => {
        resultsDiv.innerHTML += `<h4>After step ${index + 1}:</h4>` + matrixToHtml(L);
    });  




function matrixToHtml(matrix) {
    return '<pre>' + matrix.map(row => row.map(value => isNaN(value) ? 0 : value).join(' ')).join('\n') + '</pre>';
}
