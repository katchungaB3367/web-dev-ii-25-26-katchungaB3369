async function request(path, options = {}) {
  const response = await fetch(`/api/students${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (response.status === 204) return;
  let body;
  try { body = await response.json(); } catch { throw new Error('The server returned an unexpected response. Check that the API is running.'); }
  if (!response.ok) throw new Error(body.message || 'Unable to complete this request.');
  return body;
}

export const students = {
  list: () => request(''),
  save: input => {
    const { id, created_at, updated_at, ...fields } = input;
    return request(id ? `/${id}` : '', { method: id ? 'PUT' : 'POST', body: JSON.stringify(fields) });
  },
  remove: id => request(`/${id}`, { method: 'DELETE' }),
};
