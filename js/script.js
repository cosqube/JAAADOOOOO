/**
 * Jadoo - Alien Interface System
 */

class JadooSystem {
  constructor() {
    this.fullscreenActive = false;
    this.keySequence = ['B', 'C', 'F', 'E', 'B', 'C', 'E', 'D', 'B', 'C', 'F', 'E', 'D', 'E'];
    this.currentKeyIndex = 0;
    this.sequenceComplete = false;
    
    this.cacheElements();
    this.setupListeners();
  }

  cacheElements() {
    this.enterScreen = document.querySelector('.enter-screen');
    this.monitor = document.getElementById('monitor');
    this.quadrantContainer = document.querySelector('.quadrant-container');
    this.circlesContainer = document.querySelector('.circles-container');
    this.garbageRight = document.querySelector('.garbage-right');
    this.prompt = document.querySelector('.prompt');
    this.sending = document.querySelector('.sending');
    this.receiving = document.querySelector('.receiving');
    this.header = document.querySelector('.header');
    this.seaLeft = document.querySelector('.sea-left');
    this.seaRight = document.querySelector('.sea-right');
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.toggleFullscreen();
      return;
    }

    if (e.keyCode >= 66 && e.keyCode <= 70) {
      if (!this.fullscreenActive || this.sequenceComplete) {
        return;
      }

      const keyChar = String.fromCharCode(e.keyCode);
      const expectedKey = this.keySequence[this.currentKeyIndex];

      if (keyChar === expectedKey) {
        e.preventDefault();
        this.playAudio(e.keyCode);
        this.showSignalFeedback();
        setTimeout(() => {
          this.moveToNextKey();
        }, 200);
      }
    }
  }

  moveToNextKey() {
    this.currentKeyIndex++;
    
    if (this.currentKeyIndex >= this.keySequence.length) {
      this.sequenceComplete = true;
      this.showReceivingSequence();
      return;
    }
    
    this.updatePromptDisplay();
  }

  updatePromptDisplay() {
    const promptKeys = document.querySelector('.prompt-keys');
    if (promptKeys) {
      promptKeys.textContent = this.keySequence[this.currentKeyIndex];
    }
  }

  showSignalFeedback() {
    if (!this.sending) return;
    
    // Hide receiving if it's showing
    if (this.receiving) this.receiving.classList.add('hidden');
    
    // Show sending with ellipsis animation
    this.sending.classList.remove('hidden');
    this.sending.textContent = 'SENDING...';
  }

  showReceivingSequence() {
    if (!this.receiving) return;
    
    // Hide sending
    if (this.sending) this.sending.classList.add('hidden');
    
    // Show receiving in magenta
    this.receiving.classList.remove('hidden');
    this.receiving.textContent = 'RECEIVING';
    
    const receivingAudio = document.getElementById('receivingAudio');
    if (receivingAudio) {
      receivingAudio.currentTime = 0;
      receivingAudio.play().catch(err => {
        console.log('Could not play receiving audio:', err);
      });
    }
    
    setTimeout(() => {
      this.receiving.classList.add('hidden');
      this.resetSequence();
    }, 3000);
  }

  resetSequence() {
    this.currentKeyIndex = 0;
    this.sequenceComplete = false;
    this.updatePromptDisplay();
  }

  toggleFullscreen() {
    if (!this.fullscreenActive) {
      this.activateInterface();
    } else {
      this.deactivateInterface();
    }
  }

  activateInterface() {
    this.fullscreenActive = true;
    
    if (this.monitor) {
      this.monitor.style.backgroundColor = '#161913';
    }
    
    if (this.enterScreen) {
      this.enterScreen.classList.add('hidden');
    }
    
    this.showElements();
    
    // Always show sound waves and keep them visible
    if (this.seaLeft) this.seaLeft.classList.remove('hidden');
    if (this.seaRight) this.seaRight.classList.remove('hidden');
    
    this.currentKeyIndex = 0;
    this.sequenceComplete = false;
    this.updatePromptDisplay();
    
    this.requestFullscreen();
  }

  deactivateInterface() {
    this.fullscreenActive = false;
    this.exitFullscreen();
    this.hideElements();
    
    if (this.enterScreen) {
      this.enterScreen.classList.remove('hidden');
    }
    
    if (this.monitor) {
      this.monitor.style.backgroundColor = 'transparent';
    }
  }

  showElements() {
    const elements = [
      this.circlesContainer, this.garbageRight,
      this.prompt, this.header,
      this.seaLeft, this.seaRight, this.quadrantContainer
    ];
    
    elements.forEach(el => {
      if (el) el.classList.remove('hidden');
    });
  }

  hideElements() {
    const elements = [
      this.circlesContainer, this.garbageRight,
      this.prompt, this.header,
      this.seaLeft, this.seaRight, this.quadrantContainer
    ];
    
    elements.forEach(el => {
      if (el) el.classList.add('hidden');
    });
  }

  playAudio(keyCode) {
    const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.log('Could not play audio:', err);
      });
    }
  }

  requestFullscreen() {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.log('Fullscreen request failed:', err);
      });
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  exitFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.jadooSystem = new JadooSystem();
});
