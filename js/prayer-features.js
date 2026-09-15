// Prayer Features - Text-to-Speech & Share
// Adds audio playback and sharing capabilities to prayer pages

(function() {
  'use strict';

  let speechSynthesis = window.speechSynthesis;
  let currentUtterance = null;
  let isPaused = false;
  let isPlaying = false;
  const ROSARY_PAGES = new Set(['prayer.html', 'joy.html', 'light.html', 'sorrow.html', 'glorious.html']);

  // Initialize features on prayer pages only
  function init() {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    if (ROSARY_PAGES.has(currentPage)) {
      return;
    }

    // Check if we're on a prayer page (look for prayer content in various structures)
    const prayerContent = document.querySelector('.card-body, .col-lg-8.col-md-10.mx-auto center, .prayer-text, .card-text');
    console.log('Prayer Features Init - Content found:', prayerContent);
    
    if (!prayerContent) {
      console.log('Prayer Features - No prayer content found, skipping initialization');
      return;
    }

    // Add feature buttons
    console.log('Prayer Features - Adding feature buttons');
    addFeatureButtons();
  }

  // Add Text-to-Speech and Share buttons
  function addFeatureButtons() {
    // Try multiple container selectors
    let container = document.querySelector('.col-lg-8.col-md-10.mx-auto');
    
    // If not found, look for parent of prayer-text
    if (!container) {
      const prayerText = document.querySelector('.prayer-text');
      if (prayerText) {
        container = prayerText.parentElement;
      }
    }
    
    // Fallback to .container .row > div
    if (!container) {
      container = document.querySelector('.container .row > div');
    }
    
    console.log('Prayer Features - Container found:', container);
    
    if (!container) {
      console.log('Prayer Features - No container found, skipping button creation');
      return;
    }

    // Check if buttons already exist
    if (document.querySelector('.prayer-features-toolbar')) {
      console.log('Prayer Features - Toolbar already exists, skipping');
      return;
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'prayer-features-toolbar';
    toolbar.innerHTML = `
      <div class="feature-buttons">
        <button id="tts-btn" class="feature-btn" title="Listen to Prayer">
          <i class="fas fa-volume-up"></i>
          <span class="btn-text">Listen</span>
        </button>
      </div>
      <div id="tts-controls" class="tts-controls" style="display: none;">
        <button id="tts-play-pause" class="tts-control-btn">
          <i class="fas fa-pause"></i>
        </button>
        <button id="tts-stop" class="tts-control-btn">
          <i class="fas fa-stop"></i>
        </button>
        <div class="tts-speed-control">
          <label for="tts-speed"><i class="fas fa-tachometer-alt"></i></label>
          <input type="range" id="tts-speed" min="0.5" max="2" step="0.1" value="0.85">
          <span id="tts-speed-value">0.85x</span>
        </div>
      </div>
    `;

    // Insert toolbar before the prayer content
    const prayerCard = container.querySelector('.col-md-8') || container.querySelector('.card-body')?.parentElement;
    const prayerText = container.querySelector('.prayer-text');
    
    if (prayerText) {
      // Insert before prayer-text div (created by prayer-enhancer)
      container.insertBefore(toolbar, prayerText);
    } else if (prayerCard) {
      container.insertBefore(toolbar, prayerCard);
    } else {
      container.insertBefore(toolbar, container.firstChild);
    }
    
    console.log('Prayer Features - Toolbar inserted successfully');

    // Add event listeners
    document.getElementById('tts-btn').addEventListener('click', toggleTextToSpeech);
    
    // TTS controls
    const playPauseBtn = document.getElementById('tts-play-pause');
    const stopBtn = document.getElementById('tts-stop');
    const speedControl = document.getElementById('tts-speed');

    if (playPauseBtn) playPauseBtn.addEventListener('click', playPauseSpeech);
    if (stopBtn) stopBtn.addEventListener('click', stopSpeech);
    if (speedControl) {
      speedControl.addEventListener('input', function() {
        document.getElementById('tts-speed-value').textContent = this.value + 'x';
        if (currentUtterance && isPlaying) {
          // Restart with new speed
          const wasPlaying = isPlaying;
          stopSpeech();
          if (wasPlaying) {
            setTimeout(() => startTextToSpeech(), 100);
          }
        }
      });
    }

    // Add styles
    addFeatureStyles();
  }

  // Toggle Text-to-Speech
  function toggleTextToSpeech() {
    const controls = document.getElementById('tts-controls');
    
    if (isPlaying || isPaused) {
      // Stop if already playing
      stopSpeech();
      controls.style.display = 'none';
    } else {
      // Start playing
      startTextToSpeech();
      controls.style.display = 'flex';
    }
  }

  // Start Text-to-Speech
  function startTextToSpeech() {
    // Get prayer text - prioritize .prayer-text first (created by prayer-enhancer)
    let prayerContent = document.querySelector('.prayer-text');
    
    // If no prayer-text, try card-body
    if (!prayerContent) {
      prayerContent = document.querySelector('.card-body');
    }
    
    // If no card-body, try center tag inside main content (but not in header)
    if (!prayerContent) {
      const centers = document.querySelectorAll('.col-lg-8.col-md-10.mx-auto center');
      // Skip first center if it's in the header
      if (centers.length > 0) {
        prayerContent = centers[centers.length > 1 ? 1 : 0];
      }
    }
    
    // Try getting the main container with paragraphs.
    if (!prayerContent) {
      const mainContainer = document.querySelector('.col-lg-8.col-md-10.mx-auto');
      if (mainContainer) {
        const paragraphs = mainContainer.querySelectorAll('p');
        if (paragraphs.length > 0) {
          prayerContent = mainContainer;
        }
      }
    }
    
    // Last fallback
    if (!prayerContent) {
      prayerContent = document.querySelector('.prayer-content-card, .card-text');
    }
    
    if (!prayerContent) {
      alert('No prayer text found to read.');
      return;
    }

    // Clone the element to manipulate without affecting the page
    const contentClone = prayerContent.cloneNode(true);
    
    // Remove unwanted elements from the clone
    const unwantedSelectors = ['style', 'script', '.pwa-controls', 'button', '.navbar', 'header', '.masthead', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.breadcrumb-nav'];
    unwantedSelectors.forEach(selector => {
      const elements = contentClone.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Extract text content (remove HTML tags)
    let text = contentClone.textContent || contentClone.innerText;
    text = text.trim().replace(/\s+/g, ' ');

    if (!text || text.length < 10) {
      alert('No prayer text found to read.');
      return;
    }

    // Check if text is too long (some browsers have limits)
    const maxLength = 3000; // Safe limit for most browsers
    if (text.length > maxLength) {
      // Truncate at last complete sentence before limit
      text = text.substring(0, maxLength);
      const lastPeriod = text.lastIndexOf('.');
      if (lastPeriod > 0) {
        text = text.substring(0, lastPeriod + 1);
      }
      console.log('Text truncated to', text.length, 'characters for speech synthesis');
    }

    console.log('Text to read length:', text.length, 'characters');

    // Check browser support
    if (!speechSynthesis) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    // Create utterance
    currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Get speed setting (slightly slower for natural, reverent tone)
    const speed = parseFloat(document.getElementById('tts-speed').value) || 0.85;
    currentUtterance.rate = speed;
    currentUtterance.pitch = 1.15; // Higher pitch for feminine, natural voice
    currentUtterance.volume = 1.0; // Full volume

    // Select the best female voice available
    const voices = speechSynthesis.getVoices();
    
    // Priority order for selecting voices (most natural-sounding female voices first)
    const femaleVoicePreferences = [
      // Most natural English female voices (iOS/Mac)
      'Samantha', 'Karen', 'Moira', 'Tessa', 'Fiona', 'Victoria', 'Allison',
      // Microsoft natural voices
      'Microsoft Zira Desktop', 'Microsoft Aria Desktop', 'Microsoft Zira', 'Microsoft Aria',
      // Google voices
      'Google US English Female', 'Google UK English Female', 'Google female',
      // Enhanced natural voices
      'Ava', 'Nicky', 'Susan', 'Vicki',
      // General patterns
      'Female', 'female', 'woman', 'Woman'
    ];
    
    let selectedVoice = null;
    
    // Try to find best match
    for (const preference of femaleVoicePreferences) {
      selectedVoice = voices.find(voice => 
        voice.name.includes(preference) && voice.lang.startsWith('en')
      );
      if (selectedVoice) break;
    }
    
    // Fallback: any English female voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') &&
        voice.lang.startsWith('en')
      );
    }
    
    // Last resort: any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
    }
    
    if (selectedVoice) {
      currentUtterance.voice = selectedVoice;
      console.log('Using voice:', selectedVoice.name);
    } else {
      console.log('Using default system voice');
    }

    // Event handlers
    currentUtterance.onstart = function() {
      isPlaying = true;
      isPaused = false;
      updatePlayPauseButton();
      highlightListenButton(true);
    };

    currentUtterance.onend = function() {
      isPlaying = false;
      isPaused = false;
      updatePlayPauseButton();
      highlightListenButton(false);
      document.getElementById('tts-controls').style.display = 'none';
    };

    currentUtterance.onerror = function(event) {
      console.error('Speech synthesis error:', event);
      
      // Ignore 'interrupted' and 'canceled' errors (these are normal when stopping)
      if (event.error === 'interrupted' || event.error === 'canceled') {
        console.log('Speech was stopped by user');
        isPlaying = false;
        isPaused = false;
        updatePlayPauseButton();
        highlightListenButton(false);
        return;
      }
      
      isPlaying = false;
      isPaused = false;
      updatePlayPauseButton();
      highlightListenButton(false);
      
      // Show user-friendly error message
      let errorMsg = 'Could not read the prayer. ';
      if (event.error === 'network') {
        errorMsg += 'Network error.';
      } else if (event.error === 'synthesis-failed') {
        errorMsg += 'Text is too long.';
      } else if (event.error === 'text-too-long') {
        errorMsg += 'Text is too long. Try a shorter prayer.';
      } else {
        errorMsg += 'Please try again.';
      }
      
      alert(errorMsg);
    };

    // Start speaking
    speechSynthesis.speak(currentUtterance);
  }

  // Play/Pause Speech
  function playPauseSpeech() {
    if (!speechSynthesis) return;

    if (isPlaying && !isPaused) {
      // Pause
      speechSynthesis.pause();
      isPaused = true;
      isPlaying = false;
    } else if (isPaused) {
      // Resume
      speechSynthesis.resume();
      isPaused = false;
      isPlaying = true;
    }

    updatePlayPauseButton();
  }

  // Stop Speech
  function stopSpeech() {
    if (!speechSynthesis) return;

    speechSynthesis.cancel();
    isPlaying = false;
    isPaused = false;
    currentUtterance = null;
    updatePlayPauseButton();
    highlightListenButton(false);
  }

  // Update play/pause button icon
  function updatePlayPauseButton() {
    const btn = document.getElementById('tts-play-pause');
    if (!btn) return;

    const icon = btn.querySelector('i');
    if (isPlaying && !isPaused) {
      icon.className = 'fas fa-pause';
      btn.title = 'Pause';
    } else {
      icon.className = 'fas fa-play';
      btn.title = 'Play';
    }
  }

  // Highlight listen button when active
  function highlightListenButton(active) {
    const btn = document.getElementById('tts-btn');
    if (!btn) return;

    if (active) {
      btn.classList.add('active');
      btn.querySelector('.btn-text').textContent = 'Listening...';
    } else {
      btn.classList.remove('active');
      btn.querySelector('.btn-text').textContent = 'Listen';
    }
  }

  // Share Prayer
  async function sharePrayer() {
    const prayerTitle = document.querySelector('h1')?.textContent || 'Prayer';
    const prayerURL = window.location.href;

    const shareData = {
      title: `${prayerTitle} - SPC Prayer.Com`,
      text: `Join me in praying: ${prayerTitle}`,
      url: prayerURL
    };

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showShareSuccess();
      } catch (err) {
        // User cancelled or error occurred
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          fallbackShare(prayerURL);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      fallbackShare(prayerURL);
    }
  }

  // Fallback share (copy to clipboard)
  function fallbackShare(url) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showShareSuccess('Link copied to clipboard!');
      }).catch(err => {
        console.error('Could not copy text:', err);
        showShareError();
      });
    } else {
      // Old method
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        showShareSuccess('Link copied to clipboard!');
      } catch (err) {
        console.error('Could not copy text:', err);
        showShareError();
      }
      
      document.body.removeChild(textArea);
    }
  }

  // Show share success message
  function showShareSuccess(message = 'Prayer shared successfully!') {
    const notification = document.createElement('div');
    notification.className = 'share-notification success';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Show share error message
  function showShareError() {
    const notification = document.createElement('div');
    notification.className = 'share-notification error';
    notification.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>Could not share prayer. Please try again.</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Add feature styles
  function addFeatureStyles() {
    if (document.getElementById('prayer-features-styles')) return;

    const style = document.createElement('style');
    style.id = 'prayer-features-styles';
    style.textContent = `
      .prayer-features-toolbar {
        margin: 1.5rem auto;
        max-width: 100%;
      }

      .feature-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      .feature-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #9a6c2f 0%, #6b421f 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      }

      .feature-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .feature-btn:active {
        transform: translateY(0);
      }

      .feature-btn.active {
        background: linear-gradient(135deg, #6b421f 0%, #9a6c2f 100%);
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }

      .feature-btn i {
        font-size: 1.1rem;
      }

      .tts-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--bg-primary);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        flex-wrap: wrap;
      }

      body.dark-mode .tts-controls {
        background: #382a1d;
        border: 1px solid #604a32;
        color: #fff4df;
      }

      .tts-control-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #9a6c2f;
        background: white;
        color: #9a6c2f;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tts-control-btn:hover {
        background: #9a6c2f;
        color: white;
        transform: scale(1.1);
      }

      body.dark-mode .tts-control-btn {
        border-color: #d8b36a;
        background: #4a3524;
        color: #fff4df;
      }

      body.dark-mode .tts-control-btn:hover {
        background: #d8b36a;
        color: #241b14;
      }

      .tts-speed-control {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--light-bg);
        border-radius: 8px;
      }

      body.dark-mode .tts-speed-control {
        background: #4a3524;
        border: 1px solid #604a32;
      }

      .tts-speed-control label {
        color: var(--text-secondary);
        margin: 0;
      }

      body.dark-mode .tts-speed-control label,
      body.dark-mode .tts-speed-control span {
        color: #fff4df;
      }

      .tts-speed-control input[type="range"] {
        width: 100px;
        cursor: pointer;
      }

      .tts-speed-control span {
        min-width: 35px;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--primary);
      }

      .share-notification {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
      }

      .share-notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }

      .share-notification.success {
        border-left: 4px solid #10b981;
      }

      .share-notification.success i {
        color: #10b981;
        font-size: 1.5rem;
      }

      .share-notification.error {
        border-left: 4px solid #ef4444;
      }

      .share-notification.error i {
        color: #ef4444;
        font-size: 1.5rem;
      }

      .share-notification span {
        font-size: 1rem;
        color: var(--text-primary);
        font-weight: 500;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .feature-btn {
          padding: 0.625rem 1.25rem;
          font-size: 0.9rem;
        }

        .btn-text {
          display: none;
        }

        .tts-controls {
          padding: 0.75rem;
          gap: 0.75rem;
        }

        .tts-speed-control input[type="range"] {
          width: 80px;
        }

        .share-notification {
          left: 1rem;
          right: 1rem;
          transform: translateX(0) translateY(100px);
          max-width: calc(100% - 2rem);
        }

        .share-notification.show {
          transform: translateX(0) translateY(0);
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Load voices (needed for some browsers)
  if (speechSynthesis) {
    speechSynthesis.onvoiceschanged = function() {
      speechSynthesis.getVoices();
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', function() {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
  });

})();

