// Mengirim CustomEvent ke elemen jQuery yang berdiri di luar root React.
export function notify(message, type = 'success') {
  window.dispatchEvent(new CustomEvent('cozze:notice', { detail: { message, type } }));
}
