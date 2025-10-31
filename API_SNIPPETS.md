# API Usage Snippets (axios)

## Login
axios.post('/api/auth/login', { email, password }).then(r => {
  localStorage.setItem('token', r.data.token);
});

## Get my events
axios.get('/api/events', { headers: { Authorization: 'Bearer ' + token } });

## Create swap request
axios.post('/api/swap-request', { mySlotId, theirSlotId }, { headers: { Authorization: 'Bearer ' + token } });
