import './style.css';

// Функция для рендеринга главной страницы
function renderHome() {
  return `
    <section class="hero">
      <div class="container">
        <h1>Создавайте Профессиональные Музыкальные Аранжировки</h1>
        <p>Воплотите ваши творческие идеи в жизнь с помощью нашего мощного аудио редактора</p>
        <div class="hero-buttons">
          <a href="#" class="btn btn-primary" onclick="navigate('register')">Начать бесплатно</a>
          <a href="#" class="btn btn-secondary" onclick="navigate('login')">Войти</a>
        </div>
      </div>
    </section>
    <section class="features container">
      <h2 class="section-title">Возможности</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🎵</div>
          <h3>Профессиональный Аудио Редактор</h3>
          <p>Мощные инструменты для создания, редактирования и микширования музыки</p>
          <ul class="feature-list">
            <li>Многодорожечная запись</li>
            <li>Встроенные эффекты</li>
            <li>MIDI поддержка</li>
          </ul>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎚</div>
          <h3>Сведение и Мастеринг</h3>
          <p>Профессиональные инструменты для финальной обработки</p>
          <ul class="feature-list">
            <li>Эквализация</li>
            <li>Компрессия</li>
            <li>Лимитирование</li>
          </ul>
        </div>
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3>Совместная Работа</h3>
          <p>Работайте над проектами вместе с другими музыкантами</p>
          <ul class="feature-list">
            <li>Облачное хранение</li>
            <li>Управление версиями</li>
            <li>Комментарии и обсуждения</li>
          </ul>
        </div>
      </div>
    </section>   
  `;
}

// Функция для рендеринга страницы входа
function renderLogin() {
  return `
    <section class="auth-section">
      <div class="auth-container">
        <h2>Добро пожаловать</h2>
        <p class="auth-description">Войдите в свой аккаунт чтобы продолжить работу</p>
        <form class="auth-form" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label for="name">Имя:</label>
            <input type="text" id="name" required placeholder="Ваше имя">
          </div>
          <div class="form-group">
            <label for="password">Пароль:</label>
            <input type="password" id="password" required placeholder="Введите пароль">
            <a href="#" class="forgot-password">Забыли пароль?</a>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Войти</button>
          <div class="social-login">
            <button type="button" class="btn btn-google">Google</button>
            <button type="button" class="btn btn-facebook">Facebook</button>
          </div>
        </form>
        <p class="auth-links">
          Нет аккаунта? <a href="#" onclick="navigate('register')">Зарегистрироваться</a>
        </p>
      </div>
    </section>
  `;
}

// Функция для рендеринга страницы регистрации
function renderRegister() {
  return `
    <section class="auth-section">
      <div class="auth-container">
        <h2>Создать аккаунт</h2>
        <p class="auth-description">Присоединяйтесь к сообществу музыкантов</p>
        <form class="auth-form" onsubmit="handleRegister(event)">
          <div class="form-group">
            <label for="name">Имя:</label>
            <input type="text" id="name" required placeholder="Ваше имя">
          </div>
          <div class="form-group">
            <label for="password">Пароль:</label>
            <input type="password" id="password" required minlength="8" 
                   placeholder="Минимум 8 символов">
            <div class="password-strength"></div>
          </div>
          <div class="form-group">
            <label for="confirm-password">Подтвердите пароль:</label>
            <input type="password" id="confirm-password" required 
                   placeholder="Повторите пароль">
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" required>
              Я согласен с <a href="#">условиями использования</a>
            </label>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Создать аккаунт</button>
          <div class="social-login">
            <button type="button" class="btn btn-google">Google</button>
            <button type="button" class="btn btn-facebook">Facebook</button>
          </div>
        </form>
        <p class="auth-links">
          Уже есть аккаунт? <a href="#" onclick="navigate('login')">Войти</a>
        </p>
      </div>
    </section>
  `;
}

// Функция для рендеринга рабочего пространства
function renderWorkspace() {
  return `
    <div class="workspace">
      <div class="workspace-header">
        <div class="workspace-title">
          <h2>Рабочее пространство</h2>
          <input type="text" class="project-name" value="Новый проект" placeholder="Название проекта">
        </div>
        <div class="workspace-controls">
          <button class="btn btn-secondary" onclick="saveProject()">
            <i class="icon-save"></i> Сохранить
          </button>
          <button class="btn btn-primary" onclick="handleFileUpload()">
            <i class="icon-upload"></i> Загрузить аудио
          </button>
          <input type="file" id="audio-upload" accept="audio/*" multiple style="display: none" 
                 onchange="handleAudioFile(event)">
        </div>
      </div>
      
      <div class="tracks-container">
        <div class="tracks-header">
          <div class="track-controls">
            <button class="btn btn-play" onclick="playAll()">
              <i class="icon-play"></i> Воспроизвести
            </button>
            <button class="btn btn-stop" onclick="stopAll()">
              <i class="icon-stop"></i> Стоп
            </button>
            <button class="btn btn-record" onclick="startRecording()">
              <i class="icon-record"></i> Запись
            </button>
          </div>
          <div class="transport-controls">
            <span class="time-display">00:00:00</span>
            <div class="transport-buttons">
              <button class="btn btn-rewind" onclick="rewind()">
                <i class="icon-rewind"></i>
              </button>
              <button class="btn btn-forward" onclick="forward()">
                <i class="icon-forward"></i>
              </button>
            </div>
          </div>
          <div class="master-volume">
            <label>Общая громкость</label>
            <input type="range" min="0" max="100" value="100" class="volume-slider" 
                   onchange="setMasterVolume(this.value)">
            <span class="volume-value">100%</span>
          </div>
        </div>
        
        <div class="timeline">
          <div class="timeline-ruler"></div>
        </div>
        
        <div id="tracks-list" class="tracks-list">
          <!-- Треки будут добавляться здесь -->
        </div>
      </div>

      <div class="effects-panel">
        <div class="effects-header">
          <h3>Эффекты и обработка</h3>
          <button class="btn btn-add-effect">Добавить эффект</button>
        </div>
        <div class="effect-controls">
          <div class="effect-group">
            <div class="effect-header">
              <label>Реверберация</label>
              <button class="btn btn-toggle-effect">Вкл</button>
            </div>
            <div class="effect-params">
              <div class="param-group">
                <label>Размер</label>
                <input type="range" min="0" max="100" value="50" 
                       onchange="setReverbSize(this.value)">
              </div>
              <div class="param-group">
                <label>Затухание</label>
                <input type="range" min="0" max="100" value="30" 
                       onchange="setReverbDecay(this.value)">
              </div>
            </div>
          </div>
          <div class="effect-group">
            <div class="effect-header">
              <label>Эквалайзер</label>
              <button class="btn btn-toggle-effect">Вкл</button>
            </div>
            <div class="eq-controls">
              <div class="eq-band">
                <span>Низкие</span>
                <input type="range" min="-12" max="12" value="0" orient="vertical" 
                       onchange="setEQ(0, this.value)">
                <span>0 dB</span>
              </div>
              <div class="eq-band">
                <span>Средние</span>
                <input type="range" min="-12" max="12" value="0" orient="vertical" 
                       onchange="setEQ(1, this.value)">
                <span>0 dB</span>
              </div>
              <div class="eq-band">
                <span>Высокие</span>
                <input type="range" min="-12" max="12" value="0" orient="vertical" 
                       onchange="setEQ(2, this.value)">
                <span>0 dB</span>
              </div>
            </div>
          </div>
          <div class="effect-group">
            <div class="effect-header">
              <label>Компрессор</label>
              <button class="btn btn-toggle-effect">Выкл</button>
            </div>
            <div class="effect-params">
              <div class="param-group">
                <label>Порог</label>
                <input type="range" min="-60" max="0" value="-24" 
                       onchange="setCompressorThreshold(this.value)">
              </div>
              <div class="param-group">
                <label>Соотношение</label>
                <input type="range" min="1" max="20" value="4" 
                       onchange="setCompressorRatio(this.value)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Аудио контекст и обработчики
let audioContext;
let masterGainNode;
let tracks = [];
let reverbNode;
let eqNodes = [];
let compressorNode;

// Инициализация Web Audio API
function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  masterGainNode = audioContext.createGain();
  
  // Создаем узлы эффектов
  reverbNode = audioContext.createConvolver();
  compressorNode = audioContext.createDynamicsCompressor();
  
  // Создаем эквалайзер
  const frequencies = [60, 1000, 8000];
  eqNodes = frequencies.map(freq => {
    const filter = audioContext.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = freq;
    filter.Q.value = 1;
    return filter;
  });
  
  // Соединяем узлы
  masterGainNode.connect(reverbNode);
  reverbNode.connect(compressorNode);
  eqNodes.reduce((prev, curr) => {
    prev.connect(curr);
    return curr;
  }, compressorNode).connect(audioContext.destination);
}

// Обработчик загрузки файла
window.handleFileUpload = () => {
  document.getElementById('audio-upload').click();
};

// Обработчик выбора аудио файла
window.handleAudioFile = async (event) => {
  const files = event.target.files;
  if (!files.length) return;

  for (const file of files) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      try {
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        addTrack(audioBuffer, file.name);
      } catch (error) {
        console.error('Ошибка декодирования аудио:', error);
        alert(`Ошибка при загрузке файла ${file.name}`);
      }
    };
    reader.readAsArrayBuffer(file);
  }
};

// Добавление нового трека
function addTrack(audioBuffer, name) {
  const track = {
    buffer: audioBuffer,
    name: name,
    gainNode: audioContext.createGain(),
    source: null,
    playing: false,
    muted: false,
    solo: false,
    volume: 1,
    pan: 0
  };

  // Создаем панорамный узел
  const panNode = audioContext.createStereoPanner();
  track.panNode = panNode;

  // Соединяем узлы
  track.gainNode.connect(panNode);
  panNode.connect(masterGainNode);
  
  tracks.push(track);
  renderTracks();
}

// Отрисовка треков
function renderTracks() {
  const tracksList = document.getElementById('tracks-list');
  tracksList.innerHTML = tracks.map((track, index) => `
    <div class="track ${track.playing ? 'playing' : ''} ${track.muted ? 'muted' : ''} ${track.solo ? 'solo' : ''}">
      <div class="track-info">
        <div class="track-header">
          <span class="track-name" title="${track.name}">${track.name}</span>
          <div class="track-buttons">
            <button class="btn btn-mute ${track.muted ? 'active' : ''}" 
                    onclick="toggleMute(${index})">M</button>
            <button class="btn btn-solo ${track.solo ? 'active' : ''}" 
                    onclick="toggleSolo(${index})">S</button>
          </div>
        </div>
        <div class="track-controls">
          <button class="btn btn-play" onclick="playTrack(${index})">
            ${track.playing ? '⏸' : '▶'}
          </button>
          <div class="track-sliders">
            <div class="volume-control">
              <input type="range" min="0" max="100" 
                     value="${track.volume * 100}" 
                     onchange="setTrackVolume(${index}, this.value)">
              <span class="volume-value">${Math.round(track.volume * 100)}%</span>
            </div>
            <div class="pan-control">
              <input type="range" min="-100" max="100" 
                     value="${track.pan * 100}" 
                     onchange="setTrackPan(${index}, this.value)">
              <span class="pan-value">Pan: ${track.pan}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="track-waveform" id="waveform-${index}">
        <!-- Визуализация волны будет добавлена здесь -->
      </div>
    </div>
  `).join('');

  // Добавляем визуализацию для каждого трека
  tracks.forEach((track, index) => {
    if (track.buffer) {
      drawWaveform(track.buffer, `waveform-${index}`);
    }
  });
}

// Функция для отрисовки волны
function drawWaveform(buffer, containerId) {
  const container = document.getElementById(containerId);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  container.appendChild(canvas);

  const data = buffer.getChannelData(0);
  const step = Math.ceil(data.length / canvas.width);
  const amp = canvas.height / 2;

  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, amp);

  for (let i = 0; i < canvas.width; i++) {
    let min = 1.0;
    let max = -1.0;
    
    for (let j = 0; j < step; j++) {
      const datum = data[(i * step) + j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    
    ctx.lineTo(i, (1 + min) * amp);
    ctx.lineTo(i, (1 + max) * amp);
  }

  ctx.strokeStyle = '#4CAF50';
  ctx.stroke();
}

// Воспроизведение трека
window.playTrack = (index) => {
  const track = tracks[index];
  if (track.playing) {
    stopTrack(index);
    return;
  }

  track.source = audioContext.createBufferSource();
  track.source.buffer = track.buffer;
  track.source.connect(track.gainNode);
  
  track.source.onended = () => {
    track.playing = false;
    renderTracks();
  };
  
  track.source.start();
  track.playing = true;
  renderTracks();
};

// Остановка трека
window.stopTrack = (index) => {
  const track = tracks[index];
  if (!track.playing) return;

  track.source.stop();
  track.source.disconnect();
  track.playing = false;
  renderTracks();
};

// Установка громкости трека
window.setTrackVolume = (index, value) => {
  const track = tracks[index];
  track.volume = value / 100;
  track.gainNode.gain.setValueAtTime(track.volume, audioContext.currentTime);
  renderTracks();
};

// Установка панорамы трека
window.setTrackPan = (index, value) => {
  const track = tracks[index];
  track.pan = value / 100;
  track.panNode.pan.setValueAtTime(track.pan, audioContext.currentTime);
  renderTracks();
};

// Включение/выключение мьюта
window.toggleMute = (index) => {
  const track = tracks[index];
  track.muted = !track.muted;
  track.gainNode.gain.setValueAtTime(
    track.muted ? 0 : track.volume,
    audioContext.currentTime
  );
  renderTracks();
};

// Включение/выключение соло
window.toggleSolo = (index) => {
  const track = tracks[index];
  track.solo = !track.solo;
  
  const hasSoloTrack = tracks.some(t => t.solo);
  
  tracks.forEach((t, i) => {
    const shouldPlay = !hasSoloTrack || t.solo;
    t.gainNode.gain.setValueAtTime(
      shouldPlay && !t.muted ? t.volume : 0,
      audioContext.currentTime
    );
  });
  
  renderTracks();
};

// Установка общей громкости
window.setMasterVolume = (value) => {
  masterGainNode.gain.setValueAtTime(value / 100, audioContext.currentTime);
};

// Установка параметров ревербератора
window.setReverbSize = (value) => {
  // Реализация изменения размера реверберации
};

window.setReverbDecay = (value) => {
  // Реализация изменения затухания реверберации
};

// Установка параметров эквалайзера
window.setEQ = (band, value) => {
  eqNodes[band].gain.setValueAtTime(value, audioContext.currentTime);
};

// Установка параметров компрессора
window.setCompressorThreshold = (value) => {
  compressorNode.threshold.setValueAtTime(value, audioContext.currentTime);
};

window.setCompressorRatio = (value) => {
  compressorNode.ratio.setValueAtTime(value, audioContext.currentTime);
};
// Обработчики форм
window.handleLogin = (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;
  
  // Здесь должна быть реальная аутентификация
  console.log('Вход:', { name, password });
  
  // Имитация успешного входа
  localStorage.setItem('user', JSON.stringify({ name }));
  navigate('workspace');
};

window.handleRegister = (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (password !== confirmPassword) {
    alert('Пароли не совпадают');
    return;
  }
  
  if (password.length < 8) {
    alert('Пароль должен содержать минимум 8 символов');
    return;
  }
  
  // Здесь должна быть реальная регистрация
  console.log('Регистрация:', { name, password });
  
  // Имитация успешной регистрации
  localStorage.setItem('user', JSON.stringify({ name, password }));
  navigate('workspace');
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#app').innerHTML = `
    <header class="header">
      <nav class="container nav">
        <a href="#" class="nav-logo" onclick="navigate('home')">
          <img src="/logo.svg" alt="Logo" class="nav-logo-img">
          <span>Аранжировка Музыки</span>
        </a>
        <div class="nav-links">
          <a href="#" class="nav-link" onclick="navigate('home')">Главная</a>
          <a href="#" class="nav-link" onclick="navigate('login')">Вход</a>
          <a href="#" class="nav-link" onclick="navigate('register')">Регистрация</a>
        </div>
      </nav>
    </header>
    <main></main>
    <footer class="footer">
      <div class="container">
        <p>&copy; 2023 Аранжировка Музыки. Все права защищены.</p>
      </div>
    </footer>
  `;

  // Показываем главную страницу при загрузке
  navigate('home');
});
// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    // Рендерим домашнюю страницу по умолчанию
    app.innerHTML = renderHome();
  }
});

// Функция навигации
window.navigate = function(page) {
  const app = document.getElementById('app');
  switch(page) {
    case 'home':
      app.innerHTML = renderHome();
      break;
    case 'login':
      app.innerHTML = renderLogin();
      break;
    case 'register':
      app.innerHTML = renderRegister();
      break;
    case 'workspace':
      app.innerHTML = renderWorkspace();
      initAudio();
      break;
  }
}