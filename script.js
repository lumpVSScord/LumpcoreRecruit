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
        // 1巡目のみ即時読み込みし、複製分は遅延読み込みして初期負荷を軽減
        img.loading = i === 0 ? 'eager' : 'lazy';
        img.classList.add('slide-img');
        track.appendChild(img);

        if (i === 0 && !img.complete) {
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

  if (navLink && dropdownMenu && menuIcon) {
    function openDropdown() {
      dropdownMenu.classList.add('visible');
      dropdownMenu.classList.remove('hidden');
      menuIcon.classList.add('open');
    }

    function closeDropdown() {
      dropdownMenu.classList.remove('visible');
      dropdownMenu.classList.remove('hidden');
      menuIcon.classList.remove('open');
    }

    function toggleDropdown(event) {
      event.preventDefault();
      if (dropdownMenu.classList.contains('visible')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }

    navLink.addEventListener('click', toggleDropdown);

    document.addEventListener('click', function (e) {
      if (!navLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
        closeDropdown();
      }
    });

    dropdownMenu.addEventListener('click', function (e) {
      if (e.target === dropdownMenu) {
        closeDropdown();
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
        link.style.color = '#fff';
        link.style.background = 'transparent';
        link.style.transform = 'scale(1)';
      });
      link.addEventListener('click', closeDropdown);
    });

    // 初期表示やページ戻り時に必ず閉じた状態にリセット
    closeDropdown();
    window.addEventListener('pageshow', closeDropdown);
  }

  // ニュースフィルタ機能
  const newsData = [
    {
      title: "ジョブドラフトFes参加!",
      date: "2025-07-09",
      category: "採用",
      url: "news/20250709.html"
    },
    {
      title: "Winter Festival イベントレポート",
      date: "2025-02-20",
      category: "イベント",
      url: "news/20250220.html"
    },
    {
      title: "メンバー紹介：新卒1年目の挑戦",
      date: "2025-01-10",
      category: "メンバー紹介",
      url: "news/20250110.html"
    },
  ];

  const newsList = document.getElementById('news-list');
  const newsFilter = document.getElementById('news-filter');

  function displayNews(filter) {
    newsList.innerHTML = '';
    const filtered = filter === 'all' ? newsData : newsData.filter(news => news.category === filter);
    filtered.slice(0, 3).forEach(news => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = news.url;
      link.classList.add('news-link');
      link.innerHTML = `<span>${news.date}</span><span>${news.title}</span>`;
      item.appendChild(link);
      newsList.appendChild(item);
    });
  }

  newsFilter.addEventListener('change', () => displayNews(newsFilter.value));
  displayNews('all');

  // IntersectionObserver を使ったフェードイン表示
  const fadeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
});

// スクロールによる背景・ナビ表示切り替え
  const header = document.getElementById('header');
  const entryNavWrap = document.getElementById('entry-nav-wrap');
  let docHeight = document.documentElement.scrollHeight - window.innerHeight;

  window.addEventListener('resize', () => {
    docHeight = document.documentElement.scrollHeight - window.innerHeight;
  }, { passive: true });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // ページ全体のスクロール進行率を算出
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;

        // 進行率が 10% を超えたら背景とナビを切り替え
        const show = progress > 0.1;

        toggleClass(header, 'scrolled', show);
        toggleClass(entryNavWrap, 'visible', show);
        toggleClass(entryNavWrap, 'hidden', !show);
        toggleClass(document.body, 'bg-scrolled', show);
        toggleClass(document.body, 'bg-default', !show);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
