export function setAuth(auth) {
  localStorage.setItem("auth", JSON.stringify(auth));
}
export function getAuth() {
  const raw = localStorage.getItem("auth");
  return raw ? JSON.parse(raw) : null;
}
export function clearAuth() {
  localStorage.removeItem("auth");
}