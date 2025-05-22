const API_BASE = '/api';

//helper  error handling function
async function handleResponse(response) {
    if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'API request failed');
    }
    return response.json();
}

//products API
export async function getProducts() {
    const res = await fetch(`${API_BASE}/products`);
    return handleResponse(res);
}

export async function getProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse(res);
}

export async function createProduct(product) {
    const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
    });
    return handleResponse(res);
}

export async function updateProduct(id, product) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
    });
    return handleResponse(res);
}

export async function deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
    });
    return handleResponse(res);
}

//transactions API
export async function getTransactions() {
    const res = await fetch(`${API_BASE}/transactions`);
    return handleResponse(res);
}

export async function createTransaction(transaction) {
    const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
});
return handleResponse(res);
}
