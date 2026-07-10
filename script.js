// Fallback de imagem: se a foto do Google Drive não carregar, usa a cópia local em /assets
document.querySelectorAll('#heroPhoto, #aboutPhoto').forEach(img => {
  img.addEventListener('error', function onImgError(){
    this.removeEventListener('error', onImgError);
    this.src = 'assets/mary-argolo.jpg';
  });
});

const menuBtn = document.querySelector('#menuBtn');
const menu = document.querySelector('#menu');
const topbar = document.querySelector('.topbar');

menuBtn?.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

menu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});

function updateTopbar(){
  topbar?.classList.toggle('scrolled', window.scrollY > 12);
}
window.addEventListener('scroll', updateTopbar, { passive: true });
updateTopbar();

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

const categoryCards = document.querySelectorAll('.categoryCard');
const projects = document.querySelectorAll('.project');
const projectGrid = document.querySelector('#projectGrid');
const projectToolbar = document.querySelector('#projectToolbar');
const portfolioStatus = document.querySelector('#portfolioStatus');
const activeCategoryTitle = document.querySelector('#activeCategoryTitle');
const clearPortfolio = document.querySelector('#clearPortfolio');

const categoryNames = {
  reels: 'Reels',
  campanhas: 'Campanhas',
  lifestyle: 'Lifestyle',
  cortes: 'Cortes de Live',
  youtube: 'YouTube',
  outros: 'Explore mais minhas edições'
};

function showPortfolioCategory(filter){
  categoryCards.forEach(item => {
    const active = item.dataset.filter === filter;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });

  let visibleIndex = 0;
  projects.forEach(card => {
    const visible = card.dataset.category === filter;
    card.classList.toggle('hidden', !visible);
    card.classList.remove('visible');
    card.style.removeProperty('--visible-index');

    if (visible) {
      card.style.setProperty('--visible-index', visibleIndex);
      visibleIndex += 1;
      requestAnimationFrame(() => card.classList.add('visible', 'show'));
    }
  });

  projectGrid?.classList.add('active');
  if (projectToolbar) projectToolbar.hidden = false;
  if (portfolioStatus) portfolioStatus.style.display = 'none';
  if (activeCategoryTitle) {
    activeCategoryTitle.textContent = `${categoryNames[filter] || 'Projetos'} · ${visibleIndex} vídeo${visibleIndex === 1 ? '' : 's'}`;
  }

  setTimeout(() => {
    projectToolbar?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

function resetPortfolio(){
  categoryCards.forEach(item => {
    item.classList.remove('active');
    item.setAttribute('aria-pressed', 'false');
  });
  projects.forEach(card => {
    card.classList.add('hidden');
    card.classList.remove('visible');
    card.style.removeProperty('--visible-index');
  });
  projectGrid?.classList.remove('active');
  if (projectToolbar) projectToolbar.hidden = true;
  if (portfolioStatus) portfolioStatus.style.display = 'block';
}

categoryCards.forEach(btn => {
  btn.addEventListener('click', () => showPortfolioCategory(btn.dataset.filter));
});

clearPortfolio?.addEventListener('click', resetPortfolio);
resetPortfolio();

const modal = document.querySelector('#modal');
const modalImg = document.querySelector('#modalImg');
const modalVideo = document.querySelector('#modalVideo');
const modalYoutube = document.querySelector('#modalYoutube');
const modalWatch = document.querySelector('#modalWatch');
const modalCategory = document.querySelector('#modalCategory');
const modalTitle = document.querySelector('#modalTitle');
const modalDesc = document.querySelector('#modalDesc');

// Extrai o ID de um link do YouTube (funciona com watch, youtu.be e shorts)
function getYoutubeId(url){
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  return match ? match[1] : null;
}

projects.forEach(card => {
  card.addEventListener('click', () => {
    const video = card.dataset.video?.trim();
    const link = card.dataset.link?.trim();
    const category = card.dataset.category;
    const youtubeId = !video ? getYoutubeId(link) : null;

    modalCategory.textContent = categoryNames[category] || category;
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.desc || '';
    modalDesc.style.display = card.dataset.desc ? 'block' : 'none';

    // esconde tudo antes de decidir o que mostrar
    modalImg.style.display = 'none';
    modalVideo.style.display = 'none';
    modalVideo.removeAttribute('src');
    modalYoutube.style.display = 'none';
    modalYoutube.removeAttribute('src');

    if (video) {
      // vídeo próprio (arquivo .mp4 hospedado no site) — prioridade máxima
      modalVideo.src = video;
      modalVideo.style.display = 'block';
    } else if (youtubeId) {
      // toca o YouTube incorporado, direto no modal, sem sair do site
      modalYoutube.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;
      modalYoutube.style.display = 'block';
    } else {
      modalImg.src = card.dataset.img;
      modalImg.alt = card.dataset.title;
      modalImg.style.display = 'block';
    }

    if (link) {
      modalWatch.href = link;
      modalWatch.style.display = 'inline-flex';
    } else if (video) {
      modalWatch.href = video;
      modalWatch.style.display = 'inline-flex';
    } else {
      modalWatch.style.display = 'none';
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
  }
  if (modalYoutube) {
    modalYoutube.removeAttribute('src'); // remover o src é o jeito de parar o player do YouTube
  }
}

document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});
