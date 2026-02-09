// utils.js - Вспомогательные функции (частично реализованные)
// Некоторые функции могут не работать или работать не полностью

// Инициализация приложения
window.onload = function() {
  console.log('Аранжировщик музыки загружен');
  
  // Проверка поддержки Web Audio API
  checkAudioSupport();
  
  // Временный костыль для Safari
  if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
    console.warn('Safari обнаружен - могут быть проблемы с аудио');
    document.getElementById('audio-context-status').textContent = 'Аудиоконтекст: Safari (ограниченная поддержка)';
    document.getElementById('audio-context-status').style.color = 'var(--warning-color)';
  }
  
  // Показать текущего пользователя
  updateCurrentUserDisplay();
};

// Проверка поддержки аудио
function checkAudioSupport() {
  if (!window.AudioContext && !window.webkitAudioContext) {
    showModal('Внимание', 'Ваш браузер не поддерживает Web Audio API. Некоторые функции могут не работать.');
    document.getElementById('audio-context-status').textContent = 'Аудиоконтекст: не поддерживается';
    document.getElementById('audio-context-status').style.color = 'var(--error-color)';
    return false;
  }
  return true;
}

// Показать текущего пользователя
function updateCurrentUserDisplay() {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser && document.getElementById('current-user')) {
    document.getElementById('current-user').textContent = `(${currentUser})`;
  }
}

// Переключение видимости пароля
window.togglePasswordVisibility = function(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;
  
  if (input.type === 'password') {
    input.type = 'text';
    button.innerHTML = '<i class="fas fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    button.innerHTML = '<i class="fas fa-eye"></i>';
  }
};

// Очистка формы
window.clearForm = function(formType) {
  if (formType === 'login') {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    hideError('login');
  } else if (formType === 'register') {
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    hideError('register');
  }
};

// Скрыть сообщение об ошибке
function hideError(formType) {
  const errorElement = document.getElementById(`${formType}-error`);
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

// Показать сообщение об ошибке
function showError(formType, message) {
  const errorElement = document.getElementById(`${formType}-error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

// Простое модальное окно
window.showModal = function(title, message) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-message').textContent = message;
  document.getElementById('modal-overlay').style.display = 'flex';
};

window.closeModal = function() {
  document.getElementById('modal-overlay').style.display = 'none';
};

// Переключение вкладок
window.switchTab = function(tabName) {
  // Скрыть все панели
  document.getElementById('basic-controls').style.display = 'none';
  document.getElementById('advanced-controls').style.display = 'none';
  document.getElementById('fx-controls').style.display = 'none';
  
  // Убрать активный класс со всех кнопок
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Показать выбранную панель
  document.getElementById(`${tabName}-controls`).style.display = 'block';
  
  // Активировать кнопку
  document.querySelector(`.tab-btn[onclick*="${tabName}"]`).classList.add('active');
  
  // Для вкладки "Расширенные" показать предупреждение
  if (tabName === 'advanced') {
    console.log('Включены расширенные функции (экспериментальные)');
  }
};

// Обновление счетчика треков
function updateTracksCount() {
  const tracksCount = document.querySelectorAll('.track').length;
  document.getElementById('tracks-count').textContent = `(${tracksCount})`;
  
  // Показать/скрыть сообщение о пустом списке
  const noTracksMessage = document.getElementById('no-tracks-message');
  if (tracksCount === 0) {
    noTracksMessage.style.display = 'block';
  } else {
    noTracksMessage.style.display = 'none';
  }
}

// Сохранение проекта (заглушка)
window.saveProject = function() {
  showModal('В разработке', 'Функция сохранения проекта находится в разработке. В будущем вы сможете сохранять и загружать свои проекты.');
  
  // Временное решение - сохранить в localStorage
  try {
    const projectData = {
      tracks: tracks.length,
      timestamp: new Date().toISOString(),
      user: localStorage.getItem('currentUser')
    };
    localStorage.setItem('lastProject', JSON.stringify(projectData));
    console.log('Проект сохранен (временное решение)');
  } catch (error) {
    console.error('Ошибка сохранения:', error);
  }
};

// Экспорт проекта (заглушка)
window.exportProject = function() {
  showModal('Скоро будет', 'Экспорт проекта в формате MP3/WAV будет доступен в следующей версии.');
};

// Нормализация громкости (заглушка)
window.normalizeVolume = function() {
  // Это должно анализировать пики громкости и нормализовать треки
  console.log('Нормализация громкости не реализована');
  showModal('В разработке', 'Нормализация громкости будет добавлена в обновлении 1.1');
};

// Инициализация аудиоконтекста с обработкой ошибок
function initializeAudioContext() {
  if (window.audioContextInitialized) {
    return window.audioContext;
  }
  
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('AudioContext не поддерживается');
    }
    
    window.audioContext = new AudioContextClass();
    
    // Костыль для Safari/iOS
    if (window.audioContext.state === 'suspended') {
      document.addEventListener('click', function initAudio() {
        if (window.audioContext.state === 'suspended') {
          window.audioContext.resume();
        }
        document.removeEventListener('click', initAudio);
      }, { once: true });
    }
    
    window.audioContextInitialized = true;
    document.getElementById('audio-context-status').textContent = 'Аудиоконтекст: активен';
    document.getElementById('audio-context-status').style.color = 'var(--success-color)';
    
    return window.audioContext;
  } catch (error) {
    console.error('Ошибка инициализации AudioContext:', error);
    document.getElementById('audio-context-status').textContent = 'Аудиоконтекст: ошибка';
    document.getElementById('audio-context-status').style.color = 'var(--error-color)';
    return null;
  }
}

// Глобальная переменная для отслеживания состояния
window.appState = {
  audioSupported: true,
  metronomeEnabled: false,
  currentTab: 'basic',
  debugMode: false // Для отладки
};

// Включить режим отладки
if (window.location.hash === '#debug') {
  window.appState.debugMode = true;
  console.log('Режим отладки включен');
}