console.log("app.js carregado");

// =====================
// PROJECT SWITCH
// =====================
const projectItems = document.querySelectorAll('.projects li');
const contents = document.querySelectorAll('.project-content');
const rightPanel = document.getElementById('rightPanel');
const introVideo = document.getElementById('intro-video');

if (introVideo) {
  const vid = introVideo.querySelector('video');
  if (vid) vid.playbackRate = 1;
}

// Botão de voltar para mobile — filho do body para o fixed funcionar
const backBtn = document.createElement('button');
backBtn.className = 'mobile-back';
backBtn.innerHTML = '← Back';
backBtn.style.display = 'none';
document.body.appendChild(backBtn);

backBtn.addEventListener('click', () => {
  rightPanel.classList.remove('mobile-open');
  backBtn.style.display = 'none';
  contents.forEach(c => c.classList.remove('active'));
  projectItems.forEach(i => i.classList.remove('active'));
});

projectItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.target;
    const isActive = item.classList.contains('active');

    contents.forEach(c => c.classList.remove('active'));
    projectItems.forEach(i => i.classList.remove('active'));

    if (!isActive) {
      item.classList.add('active');
      const selected = document.getElementById(target);
      if (selected) {
        selected.classList.add('active');

        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          rightPanel.classList.add('mobile-open');
          backBtn.style.display = 'flex';
          rightPanel.scrollTo({ top: 0, behavior: 'instant' });
          setTimeout(() => {
            const offset = selected.offsetTop - 90;
            rightPanel.scrollTo({ top: offset, behavior: 'instant' });
          }, 10);
        } else {
          selected.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  });
});

// =====================
// HOVER PREVIEW
// =====================
const preview = document.getElementById('hover-preview');
const previewMap = {
  project1: 'imagens/previews/DSCF0033.webp',
  project2: 'imagens/previews/capa-identity-chapter-tssswo_.webp',
  project3: 'imagens/previews/222041026_3861196d-3a0f-4e0a-9881-eb57946e9333.webp',
  project4: 'imagens/previews/IMG_8851.webp',
  project5: 'imagens/previews/IMG_8867.webp',
  project8: 'imagens/previews/Artboard-1.webp',
  project9: 'imagens/previews/DSC07979.webp',
};

projectItems.forEach(item => {
  const targetId = item.dataset.target;
  if (!previewMap[targetId]) return;

  item.addEventListener('mouseenter', () => {
    preview.innerHTML = `<img src="${previewMap[targetId]}" alt="preview">`;
    preview.style.opacity = '1';
  });

  item.addEventListener('mouseleave', () => {
    preview.style.opacity = '0';
  });
});

document.addEventListener('mousemove', (e) => {
  preview.style.left = (e.clientX + 20) + 'px';
  preview.style.top = (e.clientY - 20) + 'px';
});

// =====================
// CLICK COLOR TOGGLE
// =====================
let isBlue = false;
document.addEventListener('click', (e) => {
  if (e.target.closest('.projects li')) return;
  isBlue = !isBlue;
  document.body.classList.toggle('blue-mode', isBlue);
});

// =====================
// LIGHTBOX
// =====================
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div id="lightbox-blur"></div>
  <button class="lightbox-arrow" id="lightbox-prev"><</button>
  <img id="lightbox-img" src="" alt="">
  <button class="lightbox-arrow" id="lightbox-next">></button>
`;
document.body.appendChild(lightbox);

let lightboxImages = [];
let lightboxIndex = 0;

function showLightboxItem() {
  const el = lightboxImages[lightboxIndex];
  const current = document.getElementById('lightbox-img');

  if (el.tagName === 'VIDEO') {
    const src = el.currentSrc || el.querySelector('source')?.src || '';
    current.outerHTML = `<video id="lightbox-img" src="${src}" autoplay loop muted playsinline></video>`;
  } else {
    current.outerHTML = `<img id="lightbox-img" src="${el.src}" alt="">`;
  }
}

function openLightbox(media, index) {
  lightboxImages = media;
  lightboxIndex = index;
  showLightboxItem();
  lightbox.classList.add('active');
}

function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  showLightboxItem();
}

document.getElementById('lightbox-blur').addEventListener('click', () => {
  lightbox.classList.remove('active');
});

document.getElementById('lightbox-prev').addEventListener('click', (e) => {
  e.stopPropagation();
  lightboxNav(-1);
});

document.getElementById('lightbox-next').addEventListener('click', (e) => {
  e.stopPropagation();
  lightboxNav(1);
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'ArrowLeft') lightboxNav(-1);
  if (e.key === 'Escape') lightbox.classList.remove('active');
});

document.querySelectorAll('.project-content').forEach(project => {
  const media = [...project.querySelectorAll('img, video')];
  media.forEach((el, i) => {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', () => openLightbox(media, i));
  });
});

// =====================
// SWIPE PARA FECHAR EM MOBILE
// =====================
let touchStartX = 0;
let touchStartY = 0;

// Fechar lightbox com swipe
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(deltaX) < Math.abs(deltaY)) return;
  if (Math.abs(deltaX) < 50) return;

  if (deltaX > 0) lightboxNav(-1);
  if (deltaX < 0) lightboxNav(1);
}, { passive: true });

// Fechar right panel com swipe para a direita
rightPanel.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

rightPanel.addEventListener('touchend', (e) => {
  if (window.innerWidth > 768) return;
  if (lightbox.classList.contains('active')) return;

  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(deltaX) < Math.abs(deltaY)) return;
  if (Math.abs(deltaX) < 50) return;

  if (deltaX > 0) {
    rightPanel.classList.remove('mobile-open');
    backBtn.style.display = 'none';
    contents.forEach(c => c.classList.remove('active'));
    projectItems.forEach(i => i.classList.remove('active'));
  }
}, { passive: true });