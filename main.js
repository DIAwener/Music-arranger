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

// Массив для хранения треков
let tracks = [];

// Функции для работы с аудио
window.updateMasterVolume = function(value) {
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.volume = value / 100;
    }
  });
};

window.updateTrackVolume = function(trackId, value) {
  const track = tracks[trackId];
  if (track && track.audio) {
    track.audio.volume = value / 100;
  }
};

// Добавление нового трека
window.addNewTrack = function() {
  const trackId = tracks.length;
  const trackElement = document.createElement('div');
  trackElement.className = 'track';
  trackElement.innerHTML = `
    <div class="track-info">
      <span class="track-name">Трек ${trackId + 1}</span>
      <div class="track-controls">
        <input type="range" min="0" max="100" value="100" 
               oninput="updateTrackVolume(${trackId}, this.value)">
        <button onclick="playTrack(${trackId})">Воспроизвести</button>
        <button onclick="stopTrack(${trackId})">Стоп</button>
        <button onclick="deleteTrack(${trackId})">Удалить</button>
      </div>
    </div>
  `;
  document.getElementById('tracks-list').appendChild(trackElement);
  tracks.push({ id: trackId, element: trackElement });
};

// Загрузка файла
window.handleFileUpload = function(event) {
  const file = event.target.files[0];
  if (file) {
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
          <button onclick="playTrack(${trackId})">Воспроизвести</button>
          <button onclick="stopTrack(${trackId})">Стоп</button>
          <button onclick="deleteTrack(${trackId})">Удалить</button>
        </div>
      </div>
    `;
    document.getElementById('tracks-list').appendChild(trackElement);
    tracks.push({ id: trackId, audio, element: trackElement });
  }
};

// Воспроизведение трека
window.playTrack = function(trackId) {
  const track = tracks[trackId];
  if (track && track.audio) {
    track.audio.play();
  }
};

// Остановка трека
window.stopTrack = function(trackId) {
  const track = tracks[trackId];
  if (track && track.audio) {
    track.audio.pause();
    track.audio.currentTime = 0;
  }
};

// Удаление трека
window.deleteTrack = function(trackId) {
  const track = tracks[trackId];
  if (track) {
    if (track.audio) {
      track.audio.pause();
    }
    track.element.remove();
    tracks[trackId] = null;
  }
};

// Воспроизведение всех треков
window.playAllTracks = function() {
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.play();
    }
  });
};

// Остановка всех треков
window.stopAllTracks = function() {
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.pause();
      track.audio.currentTime = 0;
    }
  });
};

// Функции для аудио эффектов
window.updatePlaybackRate = function(value) {
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.playbackRate = value / 100;
    }
  });
  document.querySelector('.effect-group .value-display').textContent = `${value}%`;
};

window.updatePan = function(value) {
  tracks.forEach(track => {
    if (track && track.audio) {
      if (!track.audioContext) {
        track.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        track.source = track.audioContext.createMediaElementSource(track.audio);
        track.panNode = track.audioContext.createStereoPanner();
        track.source.connect(track.panNode);
        track.panNode.connect(track.audioContext.destination);
      }
      track.panNode.pan.value = value / 100;
    }
  });
  const displayText = value === 0 ? 'Центр' : value < 0 ? `${Math.abs(value)}% Лево` : `${value}% Право`;
  document.querySelectorAll('.effect-group .value-display')[1].textContent = displayText;
};

window.toggleLoop = function() {
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.loop = !track.audio.loop;
    }
  });
  const btn = document.querySelector('.effect-group button');
  btn.textContent = btn.textContent.includes('Включить') ? 'Выключить повтор' : 'Включить повтор';
};

window.updateLoopStart = function(value) {
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.loopStart = parseFloat(value);
    }
  });
};

window.updateLoopEnd = function(value) {
  tracks.forEach(track => {
    if (track && track.audio) {
      track.audio.loopEnd = parseFloat(value);
    }
  });
};

window.updateTrimStart = function(value) {
  tracks.forEach(track => {
    if (track && track.audio) {
      track.trimStart = parseFloat(value);
    }
  });
};

window.updateTrimEnd = function(value) {
  tracks.forEach(track => {
    if (track && track.audio) {
      track.trimEnd = parseFloat(value);
    }
  });
};

window.applyTrim = function() {
  tracks.forEach(track => {
    if (track && track.audio && track.trimStart !== undefined && track.trimEnd !== undefined) {
      track.audio.currentTime = track.trimStart;
      const duration = track.trimEnd - track.trimStart;
      if (duration > 0) {
        track.audio.duration = duration;
      }
    }
  });
};

window.toggleMetronome = function() {
  const btn = document.querySelector('.metronome-controls button');
  if (!window.metronome) {
    window.metronome = {
      isPlaying: false,
      tempo: 120,
      audioContext: new (window.AudioContext || window.webkitAudioContext)()
    };
  }

  if (!window.metronome.isPlaying) {
    window.metronome.isPlaying = true;
    btn.textContent = 'Выключить метроном';
    playMetronome();
  } else {
    window.metronome.isPlaying = false;
    btn.textContent = 'Включить метроном';
  }
};

function playMetronome() {
  if (!window.metronome.isPlaying) return;

  const time = window.metronome.audioContext.currentTime;
  const osc = window.metronome.audioContext.createOscillator();
  const gain = window.metronome.audioContext.createGain();

  osc.connect(gain);
  gain.connect(window.metronome.audioContext.destination);

  osc.frequency.value = 1000;
  gain.gain.value = 0.5;
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

  osc.start(time);
  osc.stop(time + 0.05);

  setTimeout(playMetronome, (60 / window.metronome.tempo) * 1000);
}

window.updateTempo = function(value) {
  if (window.metronome) {
    window.metronome.tempo = parseInt(value, 10);
  }
};

// Функция навигации
window.navigate = function(page) {
  const sections = ['home-section', 'login-section', 'register-section', 'workspace-section'];
  sections.forEach(section => {
    document.getElementById(section).style.display = 'none';
  });

  document.getElementById(`${page}-section`).style.display = 'block';
  updateNavigation();
  updateUserWelcome();
};

// Функция обновления навигации
function updateNavigation() {
  const currentUser = localStorage.getItem('currentUser');
  const navLinks = document.querySelector('.nav-links');
  if (currentUser) {
    navLinks.innerHTML = `
      <a href="#" class="nav-link" onclick="navigate('home')">Главная</a>
      <a href="#" class="nav-link" onclick="navigate('workspace')">Аранжировка</a>
      <a href="#" class="nav-link" onclick="handleLogout()">Выйти</a>
    `;
  } else {
    navLinks.innerHTML = `
      <a href="#" class="nav-link" onclick="navigate('home')">Главная</a>
      <a href="#" class="nav-link" onclick="navigate('login')">Вход</a>
      <a href="#" class="nav-link" onclick="navigate('register')">Регистрация</a>
    `;
  }
}

// Функция обновления приветствия пользователя
function updateUserWelcome() {
  const currentUser = localStorage.getItem('currentUser');
  const welcomeDiv = document.getElementById('user-welcome');
  if (currentUser) {
    welcomeDiv.innerHTML = `
      <p>Добро пожаловать, ${currentUser}!</p>
      <a href="#" onclick="navigate('workspace')" class="btn btn-primary">Перейти к аранжировке</a>
    `;
  } else {
    welcomeDiv.innerHTML = '';
  }
}

// Обработчики форм
window.handleLogin = function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  try {
    const user = userStorage.checkUser(username, password);
    if (user) {
      localStorage.setItem('currentUser', username);
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
  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (password !== confirmPassword) {
    alert('Пароли не совпадают');
    return;
  }
  
  try {
    userStorage.addUser(username, password);
    alert('Регистрация успешна! Теперь вы можете войти.');
    navigate('login');
  } catch (error) {
    alert(error.message);
  }
};

window.handleLogout = function() {
  localStorage.removeItem('currentUser');
  alert('Вы вышли из системы');
  navigate('home');
};

// Инициализация приложения
updateNavigation();
navigate('home');