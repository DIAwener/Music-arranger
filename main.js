// main.js - Исправленная версия

// Функции для работы с пользователями
const userStorage = {
  getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  },
  
  saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  },
  
  addUser(username, password) {
    const users = this.getUsers();
    if (users.some(user => user.username === username)) {
      throw new Error('Пользователь с таким именем уже существует');
    }
    users.push({ username, password });
    this.saveUsers(users);
  },
  
  checkUser(username, password) {
    const users = this.getUsers();
    return users.find(user => user.username === username && user.password === password);
  }
};

// Глобальные переменные
let tracks = [];
let currentTrackIndex = -1;
let isPlayingAll = false;
let audioContext = null;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  console.log('Аранжировщик музыки инициализирован');
  
  // Инициализация навигации
  updateNavigation();
  updateUserWelcome();
  
  // Показать главную страницу
  navigate('home');
});

// Функция навигации
window.navigate = function(page) {
  console.log('Навигация на:', page);
  
  const sections = ['home-section', 'login-section', 'register-section', 'workspace-section'];
  sections.forEach(section => {
    const element = document.getElementById(section);
    if (element) {
      element.style.display = 'none';
    }
  });

  const targetSection = document.getElementById(`${page}-section`);
  if (targetSection) {
    targetSection.style.display = 'block';
    
    // Особые действия для разных страниц
    if (page === 'workspace') {
      initializeWorkspace();
    }
  }
  
  updateNavigation();
  updateUserWelcome();
};

// Функция обновления навигации
function updateNavigation() {
  const currentUser = localStorage.getItem('currentUser');
  console.log('Текущий пользователь:', currentUser);
  
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const workspaceLink = document.getElementById('workspace-link');
  const logoutLink = document.getElementById('logout-link');
  
  if (currentUser) {
    // Пользователь авторизован
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (workspaceLink) workspaceLink.style.display = 'flex';
    if (logoutLink) logoutLink.style.display = 'flex';
  } else {
    // Пользователь не авторизован
    if (loginLink) loginLink.style.display = 'flex';
    if (registerLink) registerLink.style.display = 'flex';
    if (workspaceLink) workspaceLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'none';
  }
}

// Функция обновления приветствия пользователя
function updateUserWelcome() {
  const currentUser = localStorage.getItem('currentUser');
  const welcomeDiv = document.getElementById('user-welcome');
  
  if (welcomeDiv) {
    if (currentUser) {
      welcomeDiv.innerHTML = `
        <div class="welcome-message">
          <h3>Добро пожаловать, ${currentUser}!</h3>
          <button class="btn btn-primary" onclick="navigate('workspace')">
            <i class="fas fa-sliders-h"></i> Перейти к аранжировке
          </button>
          <button class="btn btn-secondary" onclick="handleLogout()" style="margin-left: 10px;">
            <i class="fas fa-sign-out-alt"></i> Выйти
          </button>
        </div>
      `;
    } else {
      welcomeDiv.innerHTML = `
        <div class="welcome-message">
          <h3>Добро пожаловать в музыкальный аранжировщик!</h3>
          <p>Войдите или зарегистрируйтесь, чтобы начать работу</p>
          <div style="margin-top: 20px;">
            <button class="btn btn-primary" onclick="navigate('login')" style="margin-right: 10px;">
              <i class="fas fa-sign-in-alt"></i> Войти
            </button>
            <button class="btn btn-secondary" onclick="navigate('register')">
              <i class="fas fa-user-plus"></i> Зарегистрироваться
            </button>
          </div>
        </div>
      `;
    }
  }
}

// Инициализация рабочего пространства
function initializeWorkspace() {
  console.log('Инициализация рабочего пространства');
  
  // Показать текущего пользователя
  updateCurrentUserDisplay();
  
  // Обновить счетчик треков
  updateTracksCount();
  
  // Проверить аудио поддержку
  checkAudioSupport();
}

// Показать текущего пользователя
function updateCurrentUserDisplay() {
  const currentUser = localStorage.getItem('currentUser');
  const displayElement = document.getElementById('current-user');
  if (displayElement && currentUser) {
    displayElement.textContent = `(${currentUser})`;
  }
}

// Проверка поддержки аудио
function checkAudioSupport() {
  const hasAudio = !!window.Audio;
  const statusElement = document.getElementById('audio-context-status');
  
  if (statusElement) {
    if (hasAudio) {
      statusElement.textContent = 'Аудио: поддерживается';
      statusElement.style.color = 'var(--success-color)';
    } else {
      statusElement.textContent = 'Аудио: не поддерживается';
      statusElement.style.color = 'var(--error-color)';
    }
  }
}

// Обработчики форм
window.handleLogin = function(event) {
  event.preventDefault();
  console.log('Обработка входа');
  
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  
  if (!username || !password) {
    alert('Форма входа не найдена');
    return;
  }
  
  try {
    const user = userStorage.checkUser(username.value, password.value);
    if (user) {
      localStorage.setItem('currentUser', username.value);
      alert('Вход выполнен успешно!');
      navigate('home');
    } else {
      alert('Неверный никнейм или пароль');
    }
  } catch (error) {
    alert(error.message);
  }
};

window.handleRegister = function(event) {
  event.preventDefault();
  console.log('Обработка регистрации');
  
  const username = document.getElementById('newUsername');
  const password = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  
  if (!username || !password || !confirmPassword) {
    alert('Форма регистрации не найдена');
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    alert('Пароли не совпадают');
    return;
  }
  
  if (password.value.length < 6) {
    alert('Пароль должен содержать минимум 6 символов');
    return;
  }
  
  try {
    userStorage.addUser(username.value, password.value);
    alert('Регистрация успешна! Теперь вы можете войти.');
    navigate('login');
  } catch (error) {
    alert(error.message);
  }
};

window.handleLogout = function() {
  console.log('Выход из системы');
  localStorage.removeItem('currentUser');
  alert('Вы вышли из системы');
  navigate('home');
};

// Функции для работы с треками
window.addNewTrack = function() {
  console.log('Добавление нового трека');
  
  const trackId = tracks.length;
  const trackElement = document.createElement('div');
  trackElement.className = 'track';
  trackElement.innerHTML = `
    <div class="track-info">
      <span class="track-name">Трек ${trackId + 1}</span>
      <div class="track-controls">
        <input type="range" min="0" max="100" value="100" 
               oninput="updateTrackVolume(${trackId}, this.value)">
        <button class="btn" onclick="playTrack(${trackId})">
          <i class="fas fa-play"></i> Воспроизвести
        </button>
        <button class="btn" onclick="stopTrack(${trackId})">
          <i class="fas fa-stop"></i> Стоп
        </button>
        <button class="btn" onclick="deleteTrack(${trackId})">
          <i class="fas fa-trash"></i> Удалить
        </button>
      </div>
    </div>
  `;
  
  const tracksList = document.getElementById('tracks-list');
  if (tracksList) {
    tracksList.appendChild(trackElement);
  }
  
  tracks.push({ 
    id: trackId, 
    element: trackElement,
    volume: 100
  });
  
  updateTracksCount();
};

window.updateTrackVolume = function(trackId, value) {
  console.log('Обновление громкости трека', trackId, 'на', value);
  const track = tracks[trackId];
  if (track && track.audio) {
    track.audio.volume = value / 100;
  }
};

window.playTrack = function(trackId) {
  console.log('Воспроизведение трека', trackId);
  const track = tracks[trackId];
  if (track && track.audio) {
    track.audio.play().catch(error => {
      console.error('Ошибка воспроизведения:', error);
      alert('Не удалось воспроизвести аудио. Нажмите на страницу и попробуйте снова.');
    });
  } else {
    console.warn('Трек не найден или не имеет аудио');
  }
};

window.stopTrack = function(trackId) {
  console.log('Остановка трека', trackId);
  const track = tracks[trackId];
  if (track && track.audio) {
    track.audio.pause();
    track.audio.currentTime = 0;
  }
};

window.deleteTrack = function(trackId) {
  console.log('Удаление трека', trackId);
  const track = tracks[trackId];
  if (track) {
    if (confirm(`Удалить трек ${trackId + 1}?`)) {
      if (track.audio) {
        track.audio.pause();
      }
      if (track.element) {
        track.element.remove();
      }
      tracks[trackId] = null;
      updateTracksCount();
    }
  }
};

window.playAllTracks = function() {
  console.log('Воспроизведение всех треков');
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.play().catch(console.error);
    }
  });
};

window.stopAllTracks = function() {
  console.log('Остановка всех треков');
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.pause();
      track.audio.currentTime = 0;
    }
  });
};

// Функции для аудио эффектов
window.updateMasterVolume = function(value) {
  console.log('Обновление общей громкости на', value);
  const volumeValue = document.getElementById('volume-value');
  if (volumeValue) {
    volumeValue.textContent = `${value}%`;
  }
  
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.volume = value / 100;
    }
  });
};

window.updatePlaybackRate = function(value) {
  console.log('Обновление скорости воспроизведения на', value);
  const speedValue = document.getElementById('speed-value');
  if (speedValue) {
    speedValue.textContent = `${value}%`;
  }
  
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.playbackRate = value / 100;
    }
  });
};

// Обновленная функция панорамирования (простая рабочая версия)
window.updatePan = function(value) {
  console.log('Панорамирование:', value);
  
  // Обновить текст
  const panValue = document.getElementById('pan-value');
  if (panValue) {
    panValue.textContent = value == 0 ? 'Центр' : 
                          value < 0 ? `${Math.abs(value)}% Лево` : 
                          `${value}% Право`;
  }
  
  // Применить ко всем трекам
  tracks.forEach(track => {
    if (track && track.audio) {
      try {
        // Используем простой метод - баланс через volume для левого/правого
        const pan = value / 100; // -1 до 1
        
        // Создаем аудиоконтекст если нет
        if (!window.audioCtx) {
          window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Создаем простую цепочку для панорамирования
        if (!track.panner) {
          track.source = window.audioCtx.createMediaElementSource(track.audio);
          track.panner = window.audioCtx.createStereoPanner();
          
          track.source.connect(track.panner);
          track.panner.connect(window.audioCtx.destination);
        }
        
        // Устанавливаем панорамирование
        track.panner.pan.value = pan;
        
      } catch (error) {
        console.warn('Web Audio API недоступен, используем fallback');
        // Fallback: для старых браузеров
        applySimplePan(track.audio, value);
      }
    }
  });
};

// Простой fallback метод
function applySimplePan(audio, panValue) {
  if (!audio) return;
  
  // Эмуляция панорамирования через баланс громкости
  if (panValue < 0) {
    // Сдвиг влево - уменьшаем правый канал
    audio.volume = (100 + panValue) / 100; // Простая эмуляция
  } else if (panValue > 0) {
    // Сдвиг вправо - уменьшаем левый канал
    audio.volume = (100 - panValue) / 100;
  } else {
    audio.volume = 1; // Центр
  }
}

// Обновить функцию playTrack для поддержки аудиоконтекста
window.playTrack = function(trackId) {
  const track = tracks[trackId];
  if (!track || !track.audio) return;
  
  // Активировать аудиоконтекст при первом воспроизведении
  if (window.audioCtx && window.audioCtx.state === 'suspended') {
    window.audioCtx.resume();
  }
  
  track.audio.play().catch(e => {
    console.error('Ошибка воспроизведения:', e);
  });
};

// Обновить загрузку файла для корректной работы
window.handleFileUpload = function(event) {
  const file = event.target.files[0];
  if (!file || !file.type.startsWith('audio/')) return;
  
  const audio = new Audio(URL.createObjectURL(file));
  audio.crossOrigin = 'anonymous'; // Важно для работы с аудиоконтекстом
  
  const trackId = tracks.length;
  tracks.push({ 
    id: trackId, 
    audio: audio,
    pan: 0 // По умолчанию центр
  });
  
  alert(`Файл "${file.name}" загружен!`);
};

window.toggleLoop = function() {
  console.log('Переключение повтора');
  const btn = document.querySelector('#loop-btn');
  let allLooped = true;
  
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.loop = !track.audio.loop;
      if (!track.audio.loop) allLooped = false;
    }
  });
  
  if (btn) {
    if (allLooped) {
      btn.innerHTML = '<i class="fas fa-redo"></i> Выключить повтор';
    } else {
      btn.innerHTML = '<i class="fas fa-redo"></i> Включить повтор';
    }
  }
};

window.updateLoopStart = function(value) {
  console.log('Обновление начала повтора на', value);
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.loopStart = parseFloat(value) || 0;
    }
  });
};

window.updateLoopEnd = function(value) {
  console.log('Обновление конца повтора на', value);
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.loopEnd = parseFloat(value) || track.audio.duration || 0;
    }
  });
};

window.updateTrimStart = function(value) {
  console.log('Обновление начала обрезки на', value);
  // Сохраняем значение для применения позже
  window.trimStartValue = parseFloat(value) || 0;
};

window.updateTrimEnd = function(value) {
  console.log('Обновление конца обрезки на', value);
  window.trimEndValue = parseFloat(value) || 0;
};

window.applyTrim = function() {
  console.log('Применение обрезки');
  const start = window.trimStartValue || 0;
  const end = window.trimEndValue || 0;
  
  if (end <= start) {
    alert('Конец обрезки должен быть больше начала');
    return;
  }
  
  tracks.forEach(track => {
    if (track && track.audio) {
      // Простая реализация обрезки через установку времени
      track.audio.addEventListener('timeupdate', function trimHandler() {
        if (this.currentTime > end) {
          this.currentTime = start;
        }
      });
    }
  });
  
  alert('Обрезка применена (ограниченная поддержка)');
};

// Метроном
let metronomeInterval = null;
let metronomeEnabled = false;

window.toggleMetronome = function() {
  console.log('Переключение метронома');
  const btn = document.getElementById('metronome-btn');
  const tempoInput = document.getElementById('tempo-input');
  
  if (!metronomeEnabled) {
    // Включить метроном
    const tempo = tempoInput ? parseInt(tempoInput.value) || 120 : 120;
    
    // Простая реализация метронома
    metronomeInterval = setInterval(() => {
      // Создаем простой звук метронома
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 1000;
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
      } catch (error) {
        console.error('Ошибка метронома:', error);
        // Fallback: звук через Audio
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ';
        audio.play().catch(() => {
          console.log('Метроном: звук не воспроизводится');
        });
      }
    }, (60 / tempo) * 1000);
    
    metronomeEnabled = true;
    if (btn) {
      btn.innerHTML = '<i class="fas fa-drum"></i> Выключить метроном';
    }
  } else {
    // Выключить метроном
    if (metronomeInterval) {
      clearInterval(metronomeInterval);
      metronomeInterval = null;
    }
    metronomeEnabled = false;
    if (btn) {
      btn.innerHTML = '<i class="fas fa-drum"></i> Включить метроном';
    }
  }
};

window.updateTempo = function(value) {
  console.log('Обновление темпа на', value);
  if (metronomeEnabled) {
    // Если метроном включен, перезапустить с новым темпом
    window.toggleMetronome(); // Выключить
    window.toggleMetronome(); // Включить с новым темпом
  }
};

// Загрузка файлов
window.handleFileUpload = function(event) {
  console.log('Загрузка файла');
  const files = event.target.files;
  if (!files || files.length === 0) return;
  
  const file = files[0];
  
  // Проверка типа файла
  if (!file.type.startsWith('audio/')) {
    alert('Пожалуйста, выберите аудиофайл');
    return;
  }
  
  // Проверка размера файла
  if (file.size > 10 * 1024 * 1024) { // 10MB
    alert('Файл слишком большой. Максимальный размер: 10MB');
    return;
  }
  
  const audio = new Audio(URL.createObjectURL(file));
  const trackId = tracks.length;
  
  const trackElement = document.createElement('div');
  trackElement.className = 'track';
  trackElement.innerHTML = `
    <div class="track-info">
      <span class="track-name">${file.name}</span>
      <div class="track-controls">
        <input type="range" min="0" max="100" value="100" 
               oninput="updateTrackVolume(${trackId}, this.value)">
        <button class="btn" onclick="playTrack(${trackId})">
          <i class="fas fa-play"></i> Воспроизвести
        </button>
        <button class="btn" onclick="stopTrack(${trackId})">
          <i class="fas fa-stop"></i> Стоп
        </button>
        <button class="btn" onclick="deleteTrack(${trackId})">
          <i class="fas fa-trash"></i> Удалить
        </button>
      </div>
    </div>
  `;
  
  const tracksList = document.getElementById('tracks-list');
  if (tracksList) {
    tracksList.appendChild(trackElement);
  }
  
  tracks.push({ 
    id: trackId, 
    audio: audio, 
    element: trackElement,
    volume: 100
  });
  
  updateTracksCount();
  alert(`Файл "${file.name}" успешно загружен!`);
};

// Обновление счетчика треков
function updateTracksCount() {
  const count = tracks.filter(track => track !== null).length;
  const countElement = document.getElementById('tracks-count');
  if (countElement) {
    countElement.textContent = `(${count})`;
  }
  
  // Показать/скрыть сообщение о пустом списке
  const noTracksMessage = document.getElementById('no-tracks-message');
  if (noTracksMessage) {
    noTracksMessage.style.display = count === 0 ? 'block' : 'none';
  }
}

// Инициализация приложения
updateNavigation();