const controls = document.querySelector('#guide-controls');
const form = controls.querySelector('form');
const query = form.elements.q;
const stages = [...form.querySelectorAll('[name="stage"]')];
const cards = [...document.querySelectorAll('.guide-card')];
const count = document.querySelector('.guide-count');
const empty = document.querySelector('.guide-empty');
const results = document.querySelector('.guide-grid');
const normalize = value => value.normalize('NFKC').toLowerCase().trim();

const searchIndex = cards.map(card => ({
  card,
  text: normalize(card.textContent + ' ' + card.dataset.keywords)
}));

function render() {
  const terms = normalize(query.value).split(/\s+/).filter(Boolean);
  const stage = form.elements.stage.value;
  let visible = 0;

  for (const { card, text } of searchIndex) {
    const matches = (!stage || card.dataset.stage === stage) &&
      terms.every(term => text.includes(term));
    card.hidden = !matches;
    if (matches) visible += 1;
  }

  count.textContent = `${visible}件`;
  empty.hidden = visible !== 0;
  results.hidden = visible === 0;
}

function restoreFromUrl() {
  const params = new URLSearchParams(location.search);
  const stage = params.get('stage') ?? '';
  query.value = params.get('q') ?? '';
  const selected = stages.find(option => option.value === stage) ?? stages[0];
  selected.checked = true;
  render();
}

function applyFilters() {
  const url = new URL(location.href);
  for (const [key, value] of [['q', query.value.trim()], ['stage', form.elements.stage.value]]) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  if (url.href !== location.href) history.pushState(null, '', url);
  render();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  applyFilters();
});

form.addEventListener('change', event => {
  if (event.target.name === 'stage') applyFilters();
});

document.querySelector('#clear-filters').addEventListener('click', () => {
  form.reset();
  query.focus();
  applyFilters();
});

window.addEventListener('popstate', restoreFromUrl);
restoreFromUrl();
controls.hidden = false;
