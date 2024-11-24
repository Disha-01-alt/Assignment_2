document.getElementById('val').addEventListener('input', function () {
    const order = parseInt(document.getElementById('val').value);
    const errorDiv = document.getElementById('error');
    const matrixContainer = document.getElementById('input-matrix-container');
    const resultsDiv = document.getElementById('result-div');

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
            input.className = 'input-tags';
            input.dataset.row = i;
            input.dataset.col = j;
            matrixContainer.appendChild(input);
            row.push(input);
        }
        matrix.push(row);
        matrixContainer.appendChild(document.createElement('br'));
    }

    const factorButton = document.createElement('button');
    factorButton.setAttribute("id","btn-decompose")
    factorButton.textContent = 'Decompose';
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
            eliminationMatrices.push({ E, step: `Elimination to make U[${j}][${i}] = 0` });
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

function displayResults(eliminationMatrices, L_steps, U, D, originalMatrix) {
    const resultsDiv = document.getElementById('result-div');
    resultsDiv.innerHTML = '<h2>Results</h2>';

    resultsDiv.innerHTML += '<h3>Elimination Matrices:</h3>';
    eliminationMatrices.forEach(({ E, step }) => {
        resultsDiv.innerHTML += `<h4>${step}:</h4>` + matrixToHtml(E);
    });

    resultsDiv.innerHTML += '<h3>Lower Triangular Matrix L (Step-by-Step Construction):</h3>';
    L_steps.forEach((L, index) => {
        resultsDiv.innerHTML += `<h4>After step ${index + 1}:</h4>` + matrixToHtml(L);
    });

    resultsDiv.innerHTML += '<h3>Upper Triangular Matrix U (Constructed Step-by-Step):</h3>';
    let U_temp = JSON.parse(JSON.stringify(originalMatrix));
    resultsDiv.innerHTML += `<h4>Initial Matrix:</h4>` + matrixToHtml(U_temp);
    eliminationMatrices.forEach(({ E, step }) => {
        U_temp = multiplyMatrices(E, U_temp);
        resultsDiv.innerHTML += `<h4>${step}:</h4>` + matrixToHtml(U_temp);
    });

    resultsDiv.innerHTML += '<h3>Lower Triangular Matrix L:</h3>' + matrixToHtml(L_steps[L_steps.length - 1]);
    resultsDiv.innerHTML += '<h3>Diagonal Matrix D:</h3>' + matrixToHtml(D);
    resultsDiv.innerHTML += '<h3>Final Upper Triangular Matrix U:</h3>' + matrixToHtml(U);

    // Create U' (U_prime) from U with diagonal elements set to 1
    const U_prime = U.map((row, i) => row.map((value, j) => (i === j ? 1 : value)));

    // Display U_prime matrix
    resultsDiv.innerHTML += '<h3>Modified Upper Triangular Matrix U\' (U with 1s on the diagonal):</h3>' + matrixToHtml(U_prime);

    const LU = multiplyMatrices(L_steps[L_steps.length - 1], U);

    resultsDiv.innerHTML += '<h3>Result of L*D*U\':</h3>' + matrixToHtml(LU);

    const isEqual = LU.every((row, i) => row.every((value, j) => Math.abs(value - originalMatrix[i][j]) < 1e-10));
    resultsDiv.innerHTML += isEqual
        ? '<h3 style="color: green;">A = L*D*U\' verified!</h3>'
        : '<h3 style="color: red;">A ≠ L*D*U\', factorization may be incorrect.</h3>';
}

function matrixToHtml(matrix) {
    let html = '<table border="1" style="border-collapse: collapse;">';
    matrix.forEach(row => {
        html += '<tr>';
        row.forEach(value => {
            html += '<td>' + (isNaN(value) ? 0 : value) + '</td>';
        });
        html += '</tr>';
    });
    html += '</table>';
    return html;
}
