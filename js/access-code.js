/**
 * Client-side access gate for the prayer companion.
 * The access code itself is not stored in the public source.
 */
(function () {
  'use strict';

  const ACCESS_CODE_HASH = 'dabc57f3befdd27112534a6475adad0791c67ca8f52c4682b718d0bebbde0626';
  const STORAGE_KEY = 'spc_authenticated_v2';

  async function hashCode(code) {
    const data = new TextEncoder().encode(code);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  function showApp() {
    document.getElementById('access-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
  }

  function showAccessScreen() {
    document.getElementById('access-screen').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
  }

  async function validateCode() {
    const input = document.getElementById('access-code-input');
    const errorMessage = document.getElementById('error-message');
    const isValid = (await hashCode(input.value.trim())) === ACCESS_CODE_HASH;

    if (isValid) {
      localStorage.setItem(STORAGE_KEY, 'true');
      input.value = '';
      errorMessage.style.display = 'none';
      showApp();
      return;
    }

    errorMessage.textContent = 'Invalid access code. Please try again.';
    errorMessage.style.display = 'block';
    input.value = '';
  }

  window.spcLogout = function () {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('access-code-input');
    const submitButton = document.getElementById('submit-code');

    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      showApp();
    } else {
      showAccessScreen();
      input.focus();
    }

    submitButton.addEventListener('click', validateCode);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        validateCode();
      }
    });
  });
})();
