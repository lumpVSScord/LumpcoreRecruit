// 共通ユーティリティ
function showElement(el) {
  el.classList.add('visible');
  el.classList.remove('hidden');
}

function hideElement(el) {
  el.classList.add('hidden');
  el.classList.remove('visible');
}

function toggleClass(el, className, condition) {
  if (condition) {
    el.classList.add(className);
  } else {
    el.classList.remove(className);
  }
}

// トップ画像アニメーション完了後にセクションを表示
window.addEventListener('load', function () {
  const topImage = document.getElementById('top-image');

  // 最初にトップスライドをフェードイン
  const carouselRows = document.querySelectorAll('#top-image .carousel-row');
  carouselRows.forEach(row => showElement(row));

  function showSections() {
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => showElement(el));

    const allSections = document.querySelectorAll('section:not(#top-image), header');
    allSections.forEach(section => section.style.display = '');

  }

  topImage.addEventListener('animationend', function () {
    setTimeout(showSections, 1500);
  });

  setTimeout(() => {
    const alreadyVisible = document.querySelector('.visible');
    if (!alreadyVisible) {
      showSections();
    }
  }, 3000);
});

// DOM読み込み時の初期処理
document.addEventListener('DOMContentLoaded', function () {
  // 無限カルーセル用の画像パス
  const imagePath = "assets/images/team/";

  const topImages = [
    "team1.jpg", "team2.png", "team3.jpg", "team4.png",
    "team5.jpg", "team6.png", "team7.jpg", "team8.png"
  ].map(file => imagePath + file);

  const bottomImages = [
    "team9.jpg", "team10.png", "team11.jpg", "team12.png",
    "team13.jpg", "team14.png", "team15.jpg", "team16.png"
  ].map(file => imagePath + file);

  // 無限カルーセルのセットアップ
  function setupInfiniteCarousel(trackId, imageList, direction = 'left') {
    const track = document.getElementById(trackId);
    if (!track || track.dataset.loaded === 'true') return;

    const loadPromises = [];

    for (let i = 0; i < 2; i++) {
      for (const src of imageList) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '社員写真';
        // モバイル環境で画像の読み込みが遅れると
        // アニメーションが開始されずスライドが止まってしまうことがあるため
        // ヒーローセクションの画像は遅延読み込みを行わず即時に読み込む
        img.loading = 'eager';
        img.classList.add('slide-img');
        track.appendChild(img);

        if (!img.complete) {
          loadPromises.push(new Promise(resolve => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          }));
        }
      }
    }

    Promise.all(loadPromises).then(() => {
      track.classList.add('carousel-animate');
      track.classList.add(direction === 'left' ? 'animate-left' : 'animate-right');
      track.dataset.loaded = 'true';
    });
  }

  const targets = [
    { id: "carousel-track-top", images: topImages, dir: "right" },
    { id: "carousel-track-bottom", images: bottomImages, dir: "left" },
    { id: "carousel-track-top-back", images: topImages, dir: "left" },
    { id: "carousel-track-bottom-back", images: bottomImages, dir: "right" },
  ];

  targets.forEach(({ id, images, dir }) => {
    setupInfiniteCarousel(id, images, dir);
  });

  // ドロップダウンメニュー制御
  const navLink = document.querySelector('.nav-link');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const menuIcon = document.querySelector('.menu-icon');

  navLink.addEventListener('click', function (e) {
    e.preventDefault();
    dropdownMenu.classList.toggle('visible');
    menuIcon.classList.toggle('open');
  });

  document.addEventListener('click', function (e) {
    if (!navLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
      hideElement(dropdownMenu);
      menuIcon.classList.remove('open');
    }
  });

  // ドロップダウンリンクのホバー効果
  const dropdownLinks = document.querySelectorAll('.dropdown-menu li a');
  dropdownLinks.forEach(link => {
    link.addEventListener('mouseover', () => {
      link.style.transition = 'color 0.3s ease, background 0.3s ease, transform 0.3s ease';
      link.style.color = '#fff';
      link.style.background = 'linear-gradient(45deg, #4169e1, #ff69b4)';
      link.style.transform = 'scale(1.1)';
    });
    link.addEventListener('mouseout', () => {
      link.style.transition = 'color 0.3s ease, background 0.3s ease, transform 0.3s ease';
      link.style.color = '#000080';
      link.style.background = 'transparent';
      link.style.transform = 'scale(1)';
    });
    link.addEventListener('click', () => {
      hideElement(dropdownMenu);
      menuIcon.classList.remove('open');
    });
  });

  // ニュースフィルタ機能
  const newsData = [
    { title: "2025年3月 採用説明会", date: "2025-03-15", category: "採用" },
    { title: "2025年2月 インターンシップ", date: "2025-02-20", category: "採用" },
    { title: "2025年1月 新卒採用イベント", date: "2025-01-10", category: "採用" },
  ];

  const newsList = document.getElementById('news-list');
  const newsFilter = document.getElementById('news-filter');

  function displayNews(filter) {
    newsList.innerHTML = '';
    const filtered = filter === 'all' ? newsData : newsData.filter(news => news.category === filter);
    filtered.slice(0, 3).forEach(news => {
      const item = document.createElement('li');
      item.innerHTML = `<span>${news.date}</span><span>${news.title}</span>`;
      newsList.appendChild(item);
    });
  }

  newsFilter.addEventListener('change', () => displayNews(newsFilter.value));
  displayNews('all');
});

// スクロールによる背景・ナビ表示切り替え
window.addEventListener('scroll', function () {
  const header = document.getElementById('header');
  const entryNavWrap = document.getElementById('entry-nav-wrap');
  const show = window.scrollY > window.innerHeight * 0.75;

  toggleClass(header, 'scrolled', show);
  toggleClass(entryNavWrap, 'visible', show);
  toggleClass(entryNavWrap, 'hidden', !show);
  toggleClass(document.body, 'bg-scrolled', show);
  toggleClass(document.body, 'bg-default', !show);
});
