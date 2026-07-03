/* ==========================================================================
   DANIELE POMPOSELLI PORTFOLIO JAVASCRIPT
   Interactions, ScrollSpy, and Dynamic Skill Tree Line Drawing
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.skill-tree-container');
  const svg = document.getElementById('skill-tree-svg');
  const sections = document.querySelectorAll('section, footer');
  const navLinks = document.querySelectorAll('.nav-link');

  // Define experience cards node elements
  const nodes = {
    iiiteam: document.getElementById('node-iiiteam'),
    red41: document.getElementById('node-red41'),
    archipelago: document.getElementById('node-archipelago'),
    bubbletaxi: document.getElementById('node-bubbletaxi'),
    tatacook: document.getElementById('node-tatacook'),
    huawei: document.getElementById('node-huawei'),
    retro: document.getElementById('node-retro'),
    red41gameplay: document.getElementById('node-red41-gameplay')
  };

  // SVG Marker Setup (Arrowhead)
  function initSvgMarkers() {
    svg.innerHTML = ''; // Clear SVG
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrow');
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '6');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerWidth', '5');
    marker.setAttribute('markerHeight', '5');
    marker.setAttribute('orient', 'auto-start-reverse');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 0 1.5 L 7 5 L 0 8.5 z');
    path.setAttribute('fill', '#00f0ff');
    
    marker.appendChild(path);
    defs.appendChild(marker);
    svg.appendChild(defs);
  }

  // Draw connecting line between nodes
  function createLinePath(id, d, hasArrow = false) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', id);
    path.setAttribute('class', 'tree-line');
    path.setAttribute('d', d);
    if (hasArrow) {
      path.setAttribute('marker-end', 'url(#arrow)');
    }
    svg.appendChild(path);
  }

  // Calculate coordinates and draw paths
  function drawTreeLines() {
    // Only calculate and draw if we are in desktop layout (container height is fixed)
    if (window.innerWidth <= 900) {
      svg.style.display = 'none';
      return;
    }
    svg.style.display = 'block';
    
    initSvgMarkers();
    
    const containerRect = container.getBoundingClientRect();

    function getCoords(el) {
      const rect = el.getBoundingClientRect();
      return {
        left: rect.left - containerRect.left,
        right: rect.right - containerRect.left,
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top,
        width: rect.width,
        height: rect.height,
        cx: rect.left - containerRect.left + rect.width / 2,
        cy: rect.top - containerRect.top + rect.height / 2
      };
    }

    const c = {
      iiiteam: getCoords(nodes.iiiteam),
      red41: getCoords(nodes.red41),
      archipelago: getCoords(nodes.archipelago),
      bubbletaxi: getCoords(nodes.bubbletaxi),
      tatacook: getCoords(nodes.tatacook),
      huawei: getCoords(nodes.huawei),
      retro: getCoords(nodes.retro),
      red41gameplay: getCoords(nodes.red41gameplay)
    };

    // 1. Horizontal connections in Top Row
    // IIITeam -> RED41
    createLinePath(
      'line-iiiteam-red41',
      `M ${c.iiiteam.right} ${c.iiiteam.cy} L ${c.red41.left} ${c.red41.cy}`,
      true
    );

    // RED41 -> Archipelago
    createLinePath(
      'line-red41-archipelago',
      `M ${c.red41.right} ${c.red41.cy} L ${c.archipelago.left} ${c.archipelago.cy}`,
      true
    );

    // Archipelago -> Bubble Taxi
    createLinePath(
      'line-archipelago-bubbletaxi',
      `M ${c.archipelago.right} ${c.archipelago.cy} L ${c.bubbletaxi.left} ${c.bubbletaxi.cy}`,
      true
    );

    // Bubble Taxi -> TATA COOK
    createLinePath(
      'line-bubbletaxi-tatacook',
      `M ${c.bubbletaxi.right} ${c.bubbletaxi.cy} L ${c.tatacook.left} ${c.tatacook.cy}`,
      true
    );

    // TATA COOK -> RED41 Gameplay
    createLinePath(
      'line-tatacook-red41gameplay',
      `M ${c.tatacook.right} ${c.tatacook.cy} L ${c.red41gameplay.left} ${c.red41gameplay.cy}`,
      true
    );

    // Arrow going right out of RED41 Gameplay
    createLinePath(
      'line-red41gameplay-end',
      `M ${c.red41gameplay.right} ${c.red41gameplay.cy} L ${c.red41gameplay.right + 22} ${c.red41gameplay.cy}`,
      true
    );

    // 2. Bottom Row connections
    // IIITeam -> Huawei (Down then Right)
    const turnY_huawei = c.huawei.cy;
    createLinePath(
      'line-iiiteam-huawei',
      `M ${c.iiiteam.cx} ${c.iiiteam.bottom} L ${c.iiiteam.cx} ${turnY_huawei} L ${c.huawei.left} ${turnY_huawei}`,
      true
    );

    // TATA COOK -> Retro Foundations (Down)
    // TATA COOK starts at X=572. Retro starts at X=572.
    // TATA COOK center X is 572 + 85/2 = 614.5.
    // Retro top is at c.retro.top.
    createLinePath(
      'line-tatacook-retro',
      `M ${c.tatacook.cx} ${c.tatacook.bottom} L ${c.tatacook.cx} ${c.retro.top}`,
      true
    );
  }

  // Draw lines on page load and window resize
  window.addEventListener('load', drawTreeLines);
  window.addEventListener('resize', drawTreeLines);
  // Recalculate slightly later to ensure image sizes are fully loaded
  setTimeout(drawTreeLines, 500);

  // Micro-interactions: Highlight adjacent SVG paths on card hover
  const nodeConnections = {
    iiiteam: ['line-iiiteam-red41', 'line-iiiteam-huawei'],
    red41: ['line-iiiteam-red41', 'line-red41-archipelago'],
    archipelago: ['line-red41-archipelago', 'line-archipelago-bubbletaxi'],
    bubbletaxi: ['line-archipelago-bubbletaxi', 'line-bubbletaxi-tatacook'],
    tatacook: ['line-bubbletaxi-tatacook', 'line-tatacook-retro', 'line-tatacook-red41gameplay'],
    huawei: ['line-iiiteam-huawei'],
    retro: ['line-tatacook-retro'],
    red41gameplay: ['line-tatacook-red41gameplay', 'line-red41gameplay-end']
  };

  Object.keys(nodes).forEach(key => {
    const node = nodes[key];
    if (node) {
      node.addEventListener('mouseenter', () => {
        const lineIds = nodeConnections[key];
        if (lineIds) {
          lineIds.forEach(id => {
            const line = document.getElementById(id);
            if (line) {
              line.style.stroke = '#ff00d4'; // Change color to neon magenta
              line.style.strokeWidth = '3px';
              line.style.filter = 'drop-shadow(0 0 10px #ff00d4)';
            }
          });
        }
      });

      node.addEventListener('mouseleave', () => {
        const lineIds = nodeConnections[key];
        if (lineIds) {
          lineIds.forEach(id => {
            const line = document.getElementById(id);
            if (line) {
              line.style.stroke = ''; // Revert to default
              line.style.strokeWidth = '';
              line.style.filter = '';
            }
          });
        }
      });
    }
  });

  // ScrollSpy to highlight active navigation link
  function scrollSpy() {
    let currentId = '';
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    // Special case for footer/contact at bottom
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
      currentId = 'contatti';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', scrollSpy);

  // Smooth scroll for nav links (optional override fallback)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const yOffset = -70; // Header height offset
        const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
});
