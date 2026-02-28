// used this in browser console on map svg to get positions of circles

{
  const nodes = [...document.querySelectorAll('[fill=white][stroke=black]')];
  const off = 13;
  for (const i in nodes) {
    const n = nodes[i];    
    const { x, y } = n.getBBox?.() ?? { x: null, y: null };
    if (x === null) {
      nodes[i] = [
        n.cx.baseVal.value + off/2,
        n.cy.baseVal.value + off/2
      ];
      continue;
    }
    nodes[i] = [x + off/2, y + off/2];
  }
  JSON.stringify(nodes, null, 2).replace(/\[\n {4}([\d.]+),\n {4}([\d.]+)\n  \]/gm, '[$1, $2]');
}

