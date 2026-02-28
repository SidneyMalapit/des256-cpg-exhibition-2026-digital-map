import './assets/styles/style.css';

import positions from '../data/positions.json';
import vendors from '../data/vendors.json';

// wait for all content to load
await new Promise((resolve) => addEventListener('DOMContentLoaded', resolve));

const clickMap = document.getElementById('click-map') as HTMLElement;
const infoTemplate = document.getElementById('info-box-template');

if (!(infoTemplate instanceof HTMLTemplateElement)) { throw Error('info template not found'); }

for (const id in positions as [number, number][]) {
  const [x, y] = positions[id];
  const button = document.createElement('button');

  button.classList.add('interactive');
  button.id = `interactive-${+id + 1}`;
  button.style.left = `${x / 980 * 100}%`;
  button.style.top = `${y / 934 * 100}%`;

  clickMap.append(button);

  if (!vendors) { continue; }
  const items = ['name', 'handle', 'description'];
  const infoBox = infoTemplate.content.cloneNode(true) as DocumentFragment;

  for (const item of items) {
    const element = infoBox.querySelector(`.vendor-${item}`);
    const vendor = vendors.find((v) => v.id === +id + 1);
    if (!element || !vendor) { continue; }
    if (item === 'handle' && typeof vendor.handleHref === 'string') {
      const anchor = document.createElement('a');
      anchor.href = vendor.handleHref;
      anchor.textContent = (vendor as any)[item];
      element.innerHTML = '';
      element.append(anchor);
      continue;
    }
    element.textContent = (vendor as any)[item];
  }

  button.append(infoBox);
}
