import positions from '../data/positions.json';

await new Promise((resolve) => addEventListener('DOMContentLoaded', resolve));

const clickMap = document.getElementById('click-map') as HTMLElement;

for (const id in positions as [number, number][]) {
  const [x, y] = positions[id];
  const button = document.createElement('button');

  button.classList.add('interactive');
  button.id = `interactive-${id}`;
  button.style.left = `${x / 980 * 100}%`;
  button.style.top = `${y / 934 * 100}%`;

  clickMap.append(button);
}
