const menuBtn = document.querySelector('#menuBtn');
const menu = document.querySelector('#menu');

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
  categoryCards.forEach(item => item.classList.toggle('active', item.dataset.filter === filter));
  projects.forEach(card => {
    const visible = card.dataset.category === filter;
    card.classList.toggle('hidden', !visible);
  });
  projectGrid?.classList.add('active');
  if (projectToolbar) projectToolbar.hidden = false;
  if (portfolioStatus) portfolioStatus.style.display = 'none';
  if (activeCategoryTitle) activeCategoryTitle.textContent = categoryNames[filter] || 'Projetos';
  projectToolbar?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetPortfolio(){
  categoryCards.forEach(item => item.classList.remove('active'));
  projects.forEach(card => card.classList.add('hidden'));
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
const modalWatch = document.querySelector('#modalWatch');
const modalCategory = document.querySelector('#modalCategory');
const modalTitle = document.querySelector('#modalTitle');
const modalDesc = document.querySelector('#modalDesc');
const driveQualityNote = document.querySelector('#driveQualityNote');

projects.forEach(card => {
  card.addEventListener('click', () => {
    const video = card.dataset.video?.trim();
    const link = card.dataset.link?.trim();

    modalCategory.textContent = card.dataset.category;
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.desc || '';
    modalDesc.style.display = card.dataset.desc ? 'block' : 'none';

    // Se você colocou um arquivo .mp4 em data-video, ele toca dentro do modal.
    if (video) {
      modalVideo.src = video;
      modalVideo.style.display = 'block';
      modalImg.style.display = 'none';
    } else {
      modalImg.src = card.dataset.img;
      modalImg.alt = card.dataset.title;
      modalImg.style.display = 'block';
      modalVideo.removeAttribute('src');
      modalVideo.style.display = 'none';
    }

    // Se você colocou um link externo em data-link, o botão "Assistir vídeo" aparece.
    if (link) {
      modalWatch.href = link;
      modalWatch.style.display = 'inline-flex';
    } else if (video) {
      modalWatch.href = video;
      modalWatch.style.display = 'inline-flex';
    } else {
      modalWatch.style.display = 'none';
    }

    // Mostra o lembrete de qualidade apenas para vídeos hospedados no Google Drive.
    if (driveQualityNote) {
      const isDriveLink = link && link.includes('drive.google.com');
      driveQualityNote.style.display = isDriveLink ? 'block' : 'none';
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
}

document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

const range = document.querySelector('#compareRange');
const afterWrap = document.querySelector('#afterWrap');
range?.addEventListener('input', () => {
  afterWrap.style.width = `${range.value}%`;
});
