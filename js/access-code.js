/**
 * Access Code Authentication System
 * Sisters-Only Access with localStorage persistence
 */

(function() {
  'use strict';
  
  const CORRECT_CODE = 'spc@nl1ne';
  const STORAGE_KEY = 'spc_authenticated';
  
  // Check if user is already authenticated
  function isAuthenticated() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }
  
  // Set authentication status
  function setAuthenticated(status) {
    localStorage.setItem(STORAGE_KEY, status ? 'true' : 'false');
  }
  
  // Show main app content
  function showApp() {
    const accessScreen = document.getElementById('access-screen');
    const mainApp = document.getElementById('main-app');
    
    if (accessScreen) {
      accessScreen.style.display = 'none';
    }
    if (mainApp) {
      mainApp.style.display = 'block';
      mainApp.classList.add('fade-in');
    }
  }
  
  // Show access code screen
  function showAccessScreen() {
    const accessScreen = document.getElementById('access-screen');
    const mainApp = document.getElementById('main-app');
    
    if (accessScreen) {
      accessScreen.style.display = 'flex';
    }
    if (mainApp) {
      mainApp.style.display = 'none';
    }
  }
  
  // Validate access code
  function validateCode() {
    const input = document.getElementById('access-code-input');
    const errorMsg = document.getElementById('error-message');
    const code = input.value.trim();
    
    if (code === CORRECT_CODE) {
      setAuthenticated(true);
      input.value = '';
      errorMsg.style.display = 'none';
      
      // Add success animation
      const accessScreen = document.getElementById('access-screen');
      accessScreen.classList.add('access-granted');
      
      setTimeout(() => {
        showApp();
      }, 600);
    } else {
      errorMsg.textContent = 'Invalid access code. Please try again.';
      errorMsg.style.display = 'block';
      input.value = '';
      input.classList.add('shake');
      
      setTimeout(() => {
        input.classList.remove('shake');
      }, 500);
    }
  }
  
  // Logout function (for testing or manual logout)
  window.spcLogout = function() {
    setAuthenticated(false);
    window.location.href = 'index.html';
  };
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    const accessScreen = document.getElementById('access-screen');
    const submitBtn = document.getElementById('submit-code');
    const input = document.getElementById('access-code-input');
    
    // Check authentication status
    if (isAuthenticated()) {
      showApp();
    } else {
      showAccessScreen();
    }
    
    // Handle submit button
    if (submitBtn) {
      submitBtn.addEventListener('click', validateCode);
    }
    
    // Handle Enter key
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          validateCode();
        }
      });
      
      // Auto-focus input
      if (!isAuthenticated()) {
        setTimeout(() => input.focus(), 300);
      }
    }
  });
})();
