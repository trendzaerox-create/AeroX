

export function redirectToLogin(router, next = "/") {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("redirectAfterLogin", next);
  }

  const loginUrl = `/login?next=${encodeURIComponent(next)}`;

  if (router) {
    router.push(loginUrl);
    return;
  }

  if (typeof window !== "undefined") {
    window.location.href = loginUrl;
  }
}