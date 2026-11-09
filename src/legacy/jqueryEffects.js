import $ from 'jquery';

// jQuery hanya mengelola #cozze-toast di luar #root React.
// Dengan pemisahan ini, manipulasi DOM dan efek jQuery tidak mengubah DOM yang dikelola React.
export function initJQueryEffects() {
  const $toast = $('#cozze-toast');
  $toast.hide();

  const handleNotice = (event) => {
    const detail = event.originalEvent?.detail ?? {};
    const message = detail.message || 'Perubahan berhasil disimpan.';
    const type = detail.type || 'success';

    $toast
      .stop(true, true)
      .removeClass('toast-success toast-danger')
      .addClass(type === 'danger' ? 'toast-danger' : 'toast-success')
      .text(message)
      .fadeIn(180)
      .delay(2300)
      .fadeOut(320);
  };

  $(window).on('cozze:notice', handleNotice);
  return () => $(window).off('cozze:notice', handleNotice);
}
