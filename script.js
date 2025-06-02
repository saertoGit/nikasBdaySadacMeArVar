document.addEventListener("DOMContentLoaded", function () {
  const loveMessages = [
    "I love that you make me want to be a better person just by being yourself.",
    "I love that I steal your jackets and somehow look cute in them than I do in my own.",
    "I love watching Modern Family with you.",
    "I love that you're the first person I want to share news with.",
    "I love when you enjoy the food I make for you.",
    "I love that you make me terrified on roller coaster, and that you're so happy doing it.",
    "I love that you can't be next to me without holding my hand.",
    "I love that you can make me laugh, even when I'm at my lowest.",
    "I love talking shit with you.",
    "I love watching Keti Egidunashvili and Kirpichichi Ucha love story with you.",
    "I love that you made me listen to Spotify music.",
    "I love how you wore that perfume on our first date - you were trying to impress me and it totally did NOT work (but you won me over anyway).",
    "I love when you told your mom about me.",
    "I love when I panic and want to destroy my life, you stay with me and never consider leaving me.",
    "I love your jeans that fit you perfectly.",
    "I love when you lent me your headphones.",
    "I love when you walk me home.",
    "I love when you make me eat salads when I complain about my weight and walk 20k steps with me.",
    "I love when we say the same thing at the same time.",
    "I love that you like blonde girls.",
    "I love that I cost more than 300 Euros to give you a Black Jack",
    "I love when you pity me when I tell you the most random heartbreaking stories",
    "I love you when I hug you",
    "I love that you needed artificial intelligence to tell you your own social class",
    "I love that I can wish you Happy Birthday today ! ",
  ];
  let currentSection = "intro";
  let audioContext = null;
  let analyser = null;
  let microphone = null;
  let javascriptNode = null;
  let canBlowOut = false;
  let currentSongIndex = 0;
  let isPlaying = false;
  const songs = [
    { id: 1, title: "Your First Chestpain", src: "./music/mylove.mp3" },
    {
      id: 2,
      title: "The First Song I Gave You",
      src: "./music/unwritten.mp3",
    },
    {
      id: 3,
      title: "They Can't Love Me Like You",
      src: "./music/littleMix.mp3",
    },
    {
      id: 4,
      title: "O method",
      src: "./music/karma.mp3",
    },
    {
      id: 5,
      title: "I love that I made Bacho Jikidze have +1 listener ",
      src: "./music/bacho.mp3",
    },
  ];

  const audioPlayer = document.getElementById("audioPlayer");

  const sections = document.querySelectorAll(".section");
  const navDots = document.querySelectorAll(".nav-dot");

  const startBtn = document.getElementById("startBtn");
  const nextAfterStory = document.getElementById("nextAfterStory");
  const nextAfterMusic = document.getElementById("nextAfterMusic");
  const nextAfterGallery = document.getElementById("nextAfterGallery");
  const nextAfterCake = document.getElementById("nextAfterCake");
  const restartBtn = document.getElementById("restartBtn");

  const playBtn = document.getElementById("playBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const musicList = document.getElementById("musicList");
  const nowPlaying = document.getElementById("nowPlaying");

  const flame = document.getElementById("flame");

  const photoGallery = {
    photos: [
      {
        src: "./images/photo1.png",
        caption: "Our first toy kid Stick aka Nikusha ♥",
      },
      {
        src: "./images/photo2.png",
        caption: "Manifesting Pilates girl life",
      },
      {
        src: "./images/photo3.png",
        caption: "Chakhraniki minda",
      },
      {
        src: "./images/photo4.png",
        caption: "Casual samshabati da paraksevi",
      },
      {
        src: "./images/photo5.png",
        caption: "When you love someones son",
      },
      {
        src: "./images/photo6.png",
        caption: "Pray!!",
      },
      {
        src: "./images/photo7.png",
        caption: "Princess Nikusha",
      },
      {
        src: "./images/photo8.png",
        caption: "Pizdec",
      },
      {
        src: "./images/photo9.png",
        caption: "Bidasheni",
      },
    ],

    currentPhotoIndex: 0,

    init: function () {
      this.generateGallery();
      this.setupEventListeners();
    },

    generateGallery: function () {
      const galleryGrid = document.getElementById("galleryGrid");
      if (!galleryGrid) return;

      galleryGrid.innerHTML = "";

      this.photos.forEach((photo, index) => {
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";
        galleryItem.dataset.index = index;

        const img = new Image();
        img.onload = () => {
          galleryItem.innerHTML = `
                  <img src="${photo.src}" alt="${photo.caption}">
                  <div class="overlay">♥</div>
              `;
        };
        img.onerror = () => {
          galleryItem.innerHTML = `
                  <div class="placeholder-image">♥</div>
                  <div class="overlay">♥</div>
              `;
        };
        img.src = photo.src;

        galleryGrid.appendChild(galleryItem);
      });
    },

    setupEventListeners: function () {
      // Gallery item clicks
      const galleryGrid = document.getElementById("galleryGrid");
      if (galleryGrid) {
        galleryGrid.addEventListener("click", (e) => {
          const galleryItem = e.target.closest(".gallery-item");
          if (galleryItem) {
            const index = parseInt(galleryItem.dataset.index);
            this.openModal(index);
          }
        });
      }

      const modalClose = document.getElementById("modalClose");
      if (modalClose) {
        modalClose.addEventListener("click", () => {
          this.closeModal();
        });
      }

      const modalPrev = document.getElementById("modalPrev");
      if (modalPrev) {
        modalPrev.addEventListener("click", () => {
          this.previousPhoto();
        });
      }

      const modalNext = document.getElementById("modalNext");
      if (modalNext) {
        modalNext.addEventListener("click", () => {
          this.nextPhoto();
        });
      }

      document.addEventListener("keydown", (e) => {
        const photoModal = document.getElementById("photoModal");
        if (photoModal && photoModal.style.display === "block") {
          switch (e.key) {
            case "Escape":
              this.closeModal();
              break;
            case "ArrowLeft":
              this.previousPhoto();
              break;
            case "ArrowRight":
              this.nextPhoto();
              break;
          }
        }
      });

      const photoModal = document.getElementById("photoModal");
      if (photoModal) {
        photoModal.addEventListener("click", (e) => {
          if (e.target.id === "photoModal") {
            this.closeModal();
          }
        });
      }
    },

    openModal: function (index) {
      this.currentPhotoIndex = index;
      this.showPhoto();
      const photoModal = document.getElementById("photoModal");
      if (photoModal) {
        photoModal.style.display = "block";
        document.body.style.overflow = "hidden";
      }
    },

    closeModal: function () {
      const photoModal = document.getElementById("photoModal");
      if (photoModal) {
        photoModal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    },

    showPhoto: function () {
      const photo = this.photos[this.currentPhotoIndex];
      const modalImage = document.getElementById("modalImage");
      const modalCaption = document.getElementById("modalCaption");
      const photoCounter = document.getElementById("photoCounter");

      if (modalImage && modalCaption && photoCounter) {
        const img = new Image();
        img.onload = () => {
          modalImage.src = photo.src;
        };
        img.onerror = () => {
          modalImage.src =
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmY4ZWI0Ii8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNmZmNhZDQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZjVlOTQiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iODAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7inKQ8L3RleHQ+PC9zdmc+";
        };
        img.src = photo.src;

        modalCaption.textContent = photo.caption;
        photoCounter.textContent = `${this.currentPhotoIndex + 1} of ${
          this.photos.length
        }`;
      }
    },

    previousPhoto: function () {
      this.currentPhotoIndex =
        (this.currentPhotoIndex - 1 + this.photos.length) % this.photos.length;
      this.showPhoto();
    },

    nextPhoto: function () {
      this.currentPhotoIndex =
        (this.currentPhotoIndex + 1) % this.photos.length;
      this.showPhoto();
    },
  };

  startBtn.addEventListener("click", () => showSection("story"));
  nextAfterStory.addEventListener("click", () => showSection("music"));
  nextAfterMusic.addEventListener("click", () => showSection("gallery"));
  if (nextAfterGallery) {
    nextAfterGallery.addEventListener("click", () => showSection("cake"));
  }
  nextAfterCake.addEventListener("click", () => showSection("final"));
  restartBtn.addEventListener("click", () => {
    if (isPlaying) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      isPlaying = false;
      playBtn.textContent = "▶";
    }
    showSection("intro");
  });

  navDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const section = dot.getAttribute("data-section");
      showSection(section);
    });
  });

  playBtn.addEventListener("click", togglePlay);
  prevBtn.addEventListener("click", playPreviousSong);
  nextBtn.addEventListener("click", playNextSong);

  musicList.addEventListener("click", (e) => {
    const item = e.target.closest(".music-item");
    if (item) {
      const songId = parseInt(item.getAttribute("data-song"));
      playSongById(songId);
    }
  });

  function showSection(section) {
    sections.forEach((s) => {
      s.classList.remove("visible");
      s.classList.add("hidden");
    });

    const targetSection = document.getElementById(section);
    if (targetSection) {
      targetSection.classList.remove("hidden");

      setTimeout(() => {
        targetSection.classList.add("visible");
      }, 50);
    }

    navDots.forEach((dot) => {
      dot.classList.remove("active");
      if (dot.getAttribute("data-section") === section) {
        dot.classList.add("active");
      }
    });

    currentSection = section;

    if (section === "story") {
      showLoveMessages();
    } else if (section === "gallery") {
      photoGallery.init();
    } else if (section === "cake") {
      setupMicrophone();
      showFallingHearts();
    } else if (section === "final") {
      showFallingHearts();
    }
  }

  function showLoveMessages() {
    const storyMessages = document.getElementById("storyMessages");
    if (!storyMessages) return;

    storyMessages.innerHTML = "";

    loveMessages.forEach((message, index) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.textContent = message;
      storyMessages.appendChild(messageElement);
      setTimeout(() => {
        messageElement.classList.add("visible");
      }, 1000 * index);
    });
  }

  function playSongById(id) {
    const song = songs.find((s) => s.id === id);
    if (song) {
      currentSongIndex = songs.indexOf(song);
      audioPlayer.src = song.src;

      nowPlaying.textContent = song.title;
      const musicItems = musicList.querySelectorAll(".music-item");
      musicItems.forEach((item) => {
        item.classList.remove("active");
        if (parseInt(item.getAttribute("data-song")) === id) {
          item.classList.add("active");
        }
      });
      playBtn.textContent = "❚❚";
      isPlaying = true;
      audioPlayer.play().catch((error) => {
        console.error("Error playing audio:", error);
        alert(
          "There was a problem playing the audio. Make sure your music files are in the correct location."
        );
      });
    }
  }

  function togglePlay() {
    if (songs.length === 0) return;

    if (isPlaying) {
      audioPlayer.pause();
      playBtn.textContent = "▶";
      isPlaying = false;
    } else {
      if (currentSongIndex >= 0) {
        audioPlayer.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
        playBtn.textContent = "❚❚";
        isPlaying = true;
      } else {
        playSongById(songs[0].id);
      }
    }
  }

  function playPreviousSong() {
    if (songs.length === 0) return;

    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSongById(songs[currentSongIndex].id);
  }

  function playNextSong() {
    if (songs.length === 0) return;

    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSongById(songs[currentSongIndex].id);
  }

  function setupMicrophone() {
    if (!window.AudioContext && !window.webkitAudioContext) {
      alert(
        "Your browser doesn't support Web Audio API. Please try using Chrome or Firefox."
      );
      const blowInstruction = document.querySelector(".blow-instruction");
      if (blowInstruction) {
        blowInstruction.textContent = "Click the candle to blow it out!";
      }
      flame.addEventListener("click", blowOutCandle);
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
        javascriptNode.connect(audioContext.destination);

        analyser.connect(javascriptNode);

        javascriptNode.onaudioprocess = function () {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);

          let values = 0;
          for (let i = 0; i < array.length; i++) {
            values += array[i];
          }
          const average = values / array.length;
          if (average > 30) {
            blowOutCandle();
          }
        };

        canBlowOut = true;
      })
      .catch(function (err) {
        console.log("Error getting microphone", err);
        alert(
          "Couldn't access microphone. Click the candle to blow it out instead!"
        );
        const blowInstruction = document.querySelector(".blow-instruction");
        if (blowInstruction) {
          blowInstruction.textContent = "Click the candle to blow it out!";
        }
        flame.addEventListener("click", blowOutCandle);
      });
  }

  function blowOutCandle() {
    if (!flame.classList.contains("hidden")) {
      flame.classList.add("hidden");

      showFallingHearts();
      setTimeout(() => {
        nextAfterCake.classList.remove("hidden");
      }, 1500);
      if (javascriptNode) {
        javascriptNode.disconnect();
        analyser.disconnect();
        microphone.disconnect();
        if (audioContext && audioContext.state !== "closed") {
          audioContext.close();
        }
      }
    }
  }

  function showFallingHearts() {
    const heartsContainer = document.getElementById("fallingHearts");
    if (!heartsContainer) return;

    heartsContainer.style.display = "block";
    heartsContainer.innerHTML = "";

    for (let i = 0; i < 40; i++) {
      createHeart(heartsContainer);
    }
    setTimeout(() => {
      heartsContainer.style.display = "none";
    }, 8000);
  }

  function createHeart(container) {
    const heart = document.createElement("div");
    heart.classList.add("heart-particle");
    heart.innerHTML = "♥";

    const size = Math.random() * 20 + 10;
    heart.style.fontSize = `${size}px`;

    const left = Math.random() * 100;
    heart.style.left = `${left}%`;

    const duration = Math.random() * 5 + 3;
    heart.style.animationDuration = `${duration}s`;

    const delay = Math.random() * 5;
    heart.style.animationDelay = `${delay}s`;

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, (duration + delay) * 1000);
  }
});
