'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('open', open);
}

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});
navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenu(false));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 601px)').addEventListener('change', event => {
  if (event.matches) setMenu(false);
});

document.querySelectorAll('[data-dialog]').forEach(button => {
  const dialog = document.getElementById(button.dataset.dialog);
  button.addEventListener('click', () => {
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    button.focus();
  });
});

const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
}

document.querySelector('.copy-email').addEventListener('click', async () => {
  const email = 'saisony.malapati@stonybrook.edu';
  try {
    if (!navigator.clipboard) throw new Error('Clipboard not available');
    await navigator.clipboard.writeText(email);
    showToast('Email address copied.');
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.email-address'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    showToast('Email address selected. Use your device’s copy command.');
  }
});

document.getElementById('year').textContent = String(new Date().getFullYear());

if ('IntersectionObserver' in window) {
  const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
