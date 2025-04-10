// API proxy for handling CORS issues with Railway
// This routes all /api/proxy/* requests to the backend API

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = new URL(request.url);
  const queryString = url.search;
  
  // Target the Railway backend
  const targetUrl = `https://wholesome-creation-production.up.railway.app/${path}${queryString}`;
  console.log('Proxying GET request to:', targetUrl);
  
  // Forward the headers, exclude host header
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers,
      credentials: 'include',
    });
    
    // Copy all response headers to our response
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });
    
    // Return the proxied response
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Proxy request failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle POST requests
export async function POST(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = new URL(request.url);
  const queryString = url.search;
  
  // Target the Railway backend
  const targetUrl = `https://wholesome-creation-production.up.railway.app/${path}${queryString}`;
  console.log('Proxying POST request to:', targetUrl);
  
  // Forward the headers, exclude host header
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  try {
    // Clone the request to get its body
    const requestClone = request.clone();
    const body = await requestClone.text();
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      credentials: 'include',
      body
    });
    
    // Copy all response headers to our response
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });
    
    // Return the proxied response
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Proxy request failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle all other HTTP methods
export async function PUT(request: Request, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, 'PUT');
}

export async function DELETE(request: Request, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, 'DELETE');
}

export async function PATCH(request: Request, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, 'PATCH');
}

async function handleRequest(
  request: Request,
  { params }: { params: { path: string[] } },
  method: string
) {
  const path = params.path.join('/');
  const url = new URL(request.url);
  const queryString = url.search;
  
  // Target the Railway backend
  const targetUrl = `https://wholesome-creation-production.up.railway.app/${path}${queryString}`;
  console.log(`Proxying ${method} request to:`, targetUrl);
  
  // Forward the headers, exclude host header
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  try {
    // Clone the request to get its body
    const requestClone = request.clone();
    const body = await requestClone.text();
    
    const response = await fetch(targetUrl, {
      method,
      headers,
      credentials: 'include',
      body
    });
    
    // Copy all response headers to our response
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });
    
    // Return the proxied response
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Proxy request failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 