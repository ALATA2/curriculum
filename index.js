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

  // Multi-Language Translation Data
  const translations = {
    it: {
      nav_home: "HOME",
      nav_portfolio: "PORTFOLIO",
      nav_services: "SERVICES",
      nav_about: "ABOUT",
      nav_contact: "CONTACT",
      hero_subtitle: "CREATIVO DIGITALE | SVILUPPATORE INDIE | 3D & AI ARTIST",
      hero_explore: "ESPLORA I PROGETTI",
      hero_contact: "CONTATTAMI",
      chi_sono_title: "CHI SONO",
      chi_sono_text: "Sono un creativo digitale e sviluppatore indipendente con un background che affonda le radici nella storia del videogioco (Commodore, Amiga) e guarda alle tecnologie del futuro. Nel mio percorso ho unito una formazione artistica (Liceo Artistico) a competenze tecniche (Informatica - Università di Torino), sviluppando un profilo ibrido e versatile. Che si tratti di produrre titoli indie in team o di collaborare con aziende dell'entertainment per la creazione di esperienze interattive, il mio obiettivo è fondere creatività, intelligenza artificiale e solido game design per realizzare progetti digitali originali, scalabili e commercialmente riconoscibili.",
      competenze_title: "COMPETENZE CORE",
      skill_3d_title: "3D Art & Pipeline Visiva",
      skill_3d_desc: "(Blender, asset, materiali)",
      skill_ai_title: "AI Power User",
      skill_ai_desc: "(AI Generativa: texture, concept art, mesh 3D)",
      skill_code_title: "Sviluppo & Prototipazione",
      skill_code_desc: "(HTML, CSS3, JS vanilla)",
      skill_design_title: "Game & Level Design",
      esperienze_title: "ESPERIENZE",
      progetti_web_title: "PROGETTI WEB",
      contact_email: "Email"
    },
    en: {
      nav_home: "HOME",
      nav_portfolio: "PORTFOLIO",
      nav_services: "SERVICES",
      nav_about: "ABOUT",
      nav_contact: "CONTACT",
      hero_subtitle: "DIGITAL CREATIVE | INDIE DEVELOPER | 3D & AI ARTIST",
      hero_explore: "EXPLORE PROJECTS",
      hero_contact: "CONTACT ME",
      chi_sono_title: "ABOUT ME",
      chi_sono_text: "I am a digital creative and independent developer with a background rooted in video game history (Commodore, Amiga) looking towards future technologies. In my career, I have combined an artistic education (Art High School) with technical skills (Computer Science - University of Turin), developing a versatile hybrid profile. Whether producing indie titles in a team or collaborating with entertainment companies to create interactive experiences, my goal is to merge creativity, artificial intelligence, and solid game design to deliver digital projects that are original, scalable, and commercially recognizable.",
      competenze_title: "CORE SKILLS",
      skill_3d_title: "3D Art & Visual Pipeline",
      skill_3d_desc: "(Blender, assets, materials)",
      skill_ai_title: "AI Power User",
      skill_ai_desc: "(Generative AI: textures, concept art, 3D mesh)",
      skill_code_title: "Coding & Prototyping",
      skill_code_desc: "(HTML, CSS3, vanilla JS)",
      skill_design_title: "Game & Level Design",
      esperienze_title: "EXPERIENCE",
      progetti_web_title: "WEB PROJECTS",
      contact_email: "Email"
    },
    ja: {
      nav_home: "ホーム",
      nav_portfolio: "ポートフォリオ",
      nav_services: "サービス",
      nav_about: "アバウト",
      nav_contact: "連絡先",
      hero_subtitle: "デジタルクリエイティブ | インディー開発者 | 3D & AI アーティスト",
      hero_explore: "プロジェクトを見る",
      hero_contact: "お問い合わせ",
      chi_sono_title: "自己紹介",
      chi_sono_text: "コモドールやアミガといったビデオゲームの歴史にルーツを持ち、未来のテクノロジーを見据えて活動するデジタルクリエイター兼インディー開発者です。これまでのキャリアで、美術高校での芸術的な教育とトリノ大学での情報科学の技術的なスキルを融合させ、多才でハイブリッドなプロフィールを築いてきました。チームでのインディータイトルの制作から、エンターテインメント企業と連携したインタラクティブ体験の創造にいたるまで、私の目標は創造性、人工知能（AI）、そして確かなゲームデザインを融合し、オリジナリティがあり、スケール可能で、商業的に認知されるデジタルプロジェクトを実現することです。",
      competenze_title: "コアスキル",
      skill_3d_title: "3Dアート & ビジュアルパイプライン",
      skill_3d_desc: "(Blender, アセット, マテリアル)",
      skill_ai_title: "AIパワーユーザー",
      skill_ai_desc: "(生成AI: テクスチャ, コンセプトアート, 3Dメッシュ)",
      skill_code_title: "開発 & プロトタイピング",
      skill_code_desc: "(HTML, CSS3, バニラJS)",
      skill_design_title: "ゲーム & レベルデザイン",
      esperienze_title: "経歴・実績",
      progetti_web_title: "ウェブプロジェクト",
      contact_email: "Eメール"
    }
  };

  // Language selector button event listeners
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      setLanguage(selectedLang);
    });
  });

  function setLanguage(lang) {
    // Toggle active class on language selector buttons
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Redraw experiences connection lines since translation text may shift layouts slightly
    setTimeout(drawTreeLines, 100);
  }
});
