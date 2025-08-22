const { displayNews } = require('../script.js');

describe('displayNews', () => {
  let newsList;
  let newsData;

  beforeEach(() => {
    document.body.innerHTML = '<ul id="news-list"></ul>';
    newsList = document.getElementById('news-list');
    newsData = [
      { title: '2025年3月 採用説明会', date: '2025-03-15', category: '採用' },
      { title: '2025年2月 インターンシップ', date: '2025-02-20', category: '採用' },
      { title: '2025年1月 新卒採用イベント', date: '2025-01-10', category: '採用' },
      { title: '2024年12月 社内イベント', date: '2024-12-01', category: 'イベント' }
    ];
  });

  test('filters news by category 採用', () => {
    displayNews('採用', newsList, newsData);
    const items = newsList.querySelectorAll('li');
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toContain('採用説明会');
    expect(items[2].textContent).toContain('新卒採用イベント');
  });

  test('filters news by category イベント', () => {
    displayNews('イベント', newsList, newsData);
    const items = newsList.querySelectorAll('li');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toContain('社内イベント');
  });

  test('returns top 3 when filter is all', () => {
    displayNews('all', newsList, newsData);
    const items = newsList.querySelectorAll('li');
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toContain('採用説明会');
    expect(items[2].textContent).toContain('新卒採用イベント');
  });
});
