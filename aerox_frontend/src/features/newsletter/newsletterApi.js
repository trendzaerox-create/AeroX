const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

async function parseResponse(res) {
  const text = await res.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      data ||
      "Something went wrong";

    throw new Error(message);
  }

  return data;
}

export async function subscribeNewsletterApi(email) {
  const res = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return parseResponse(res);
}

export async function getNewsletterSubscribersApi(token) {
  const res = await fetch(`${API_BASE_URL}/api/admin/newsletter/subscribers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(res);
}

export async function deleteNewsletterSubscriberApi(id, token) {
  const res = await fetch(
    `${API_BASE_URL}/api/admin/newsletter/subscribers/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return parseResponse(res);
}