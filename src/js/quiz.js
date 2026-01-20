/* calculate horizontal ducts */
const MIN_WIDTH = 60;
const PADDING = 0;
const GAP = 8;

function updateGrid_Horizontal() {
  // Select all elements with autoGrid class
  const grids = document.querySelectorAll('.autoGrid');
  
  grids.forEach(grid => {
    const width = grid.clientWidth - PADDING;
    const count = Math.max(1, Math.floor(width / (MIN_WIDTH + GAP)));

    grid.style.gridTemplateColumns = `repeat(${count}, minmax(0, 1fr))`;
    grid.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const div = document.createElement('div');
      div.className = 'grid-item';
      grid.appendChild(div);
    }
  });
}

window.addEventListener('resize', updateGrid_Horizontal);
updateGrid_Horizontal();

