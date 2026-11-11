const storageKey = 'print-room-checklist';
const items = [...document.querySelectorAll('.check-label input')];
const count = document.querySelector('#check-count');
const resetButton = document.querySelector('.check-reset');
const meter = document.querySelector('#check-meter');
const storageMessage = document.querySelector('#check-storage');

function updateProgress() {
  const checkedCount = items.filter(item => item.checked).length;
  count.textContent = `確認済み ${checkedCount} / ${items.length} 件`;
  meter.value = checkedCount;
  resetButton.setAttribute('aria-disabled', String(checkedCount === 0));
}

function restoreChecks() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    items.forEach(item => {
      item.checked = Array.isArray(saved) && saved.includes(item.id);
    });
  } catch {
    storageMessage.textContent = '保存したチェックを読み込めませんでした。';
  }
  updateProgress();
}

function saveChecks() {
  updateProgress();
  try {
    localStorage.setItem(storageKey, JSON.stringify(items.filter(item => item.checked).map(item => item.id)));
    storageMessage.textContent = 'チェックはこのブラウザに保存されます。';
  } catch {
    storageMessage.textContent = 'このブラウザではチェックを保存できません。';
  }
}

items.forEach(item => item.addEventListener('change', saveChecks));
resetButton.addEventListener('click', () => {
  if (resetButton.getAttribute('aria-disabled') === 'true') return;
  items.forEach(item => { item.checked = false; });
  saveChecks();
});

restoreChecks();
resetButton.hidden = false;
window.addEventListener('pageshow', restoreChecks);
const returnItem = items.find(item => '#' + item.id === location.hash);
returnItem?.focus();
