// Generates all app icon / splash PNG assets from SVG using the
// "classic" weather brand variant.
//
// Run: node scripts/generate-assets.mjs
//
// Outputs (all in assets/images/):
//   icon.png                   1024×1024  full squircle app icon
//   splash-icon.png             512×512  icon on transparent bg for splash
//   android-icon-foreground.png 1024×1024 cloud+sun only (no bg)
//   android-icon-background.png 1024×1024 solid sky gradient bg
//   android-icon-monochrome.png 1024×1024 white silhouette on transparent
//   favicon.png                   64×64  small web favicon

import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../assets/images');
mkdirSync(OUT, { recursive: true });

// ─── Classic variant tokens ──────────────────────────────────────────────────
const C = {
  tileBg1: '#84CDFB',
  tileBg2: '#2A9DEC',
  tileBg3: '#1869A4',
  sun:      '#FFC23B',
  sunHi:    '#FFE694',
  rays:     '#FFE694',
  cloud:    '#FFFFFF',
  cloudShade: '#E1F2FF',
};

// ─── Icon artwork (200×200 viewBox) ─────────────────────────────────────────
function iconArt({ showBg = true, monochrome = false } = {}) {
  const sunCx = 78, sunCy = 78, sunR = 30;

  const fill  = (c) => monochrome ? '#FFFFFF' : c;
  const rays = [];
  for (let i = 0; i < 8; i++) {
    const a     = (i * Math.PI) / 4;
    const inner = sunR + 8;
    const outer = sunR + 22;
    const x1 = sunCx + Math.cos(a) * inner;
    const y1 = sunCy + Math.sin(a) * inner;
    const x2 = sunCx + Math.cos(a) * outer;
    const y2 = sunCy + Math.sin(a) * outer;
    rays.push(`<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"
      stroke="${fill(C.rays)}" stroke-width="8" stroke-linecap="round" opacity="0.95"/>`);
  }

  const bgDef = showBg
    ? `<defs>
        <linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stop-color="${C.tileBg1}"/>
          <stop offset="60%"  stop-color="${C.tileBg2}"/>
          <stop offset="100%" stop-color="${C.tileBg3}"/>
        </linearGradient>
      </defs>`
    : '';

  const bgRect = showBg
    ? `<rect x="0" y="0" width="200" height="200" fill="url(#bg)"/>`
    : '';

  const shine = showBg
    ? `<defs>
        <radialGradient id="shine" cx="50%" cy="-10%" r="120%">
          <stop offset="0%"   stop-color="#FFFFFF" stop-opacity="0.55"/>
          <stop offset="60%"  stop-color="#FFFFFF" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="200" height="200" fill="url(#shine)"/>`
    : '';

  return `
    ${bgDef}
    ${bgRect}
    ${shine}
    <!-- rays -->
    ${rays.join('\n    ')}
    <!-- sun body -->
    <circle cx="${sunCx}" cy="${sunCy}" r="${sunR}" fill="${fill(C.sun)}"/>
    <circle cx="${sunCx - 8}" cy="${sunCy - 8}" r="${sunR * 0.55}" fill="${fill(C.sunHi)}" opacity="0.7"/>
    <!-- cloud shadow -->
    <ellipse cx="118" cy="148" rx="62" ry="10" fill="${monochrome ? 'rgba(255,255,255,0.25)' : 'rgba(14,53,89,0.18)'}"/>
    <!-- cloud puffs -->
    <circle cx="78"  cy="120" r="22" fill="${fill(C.cloudShade)}"/>
    <circle cx="105" cy="108" r="30" fill="${fill(C.cloud)}"/>
    <circle cx="138" cy="112" r="26" fill="${fill(C.cloud)}"/>
    <circle cx="160" cy="124" r="20" fill="${fill(C.cloud)}"/>
    <!-- cloud base -->
    <rect x="74" y="125" width="92" height="22" rx="11" fill="${fill(C.cloud)}"/>
    <!-- cloud highlight -->
    <ellipse cx="100" cy="98" rx="16" ry="5" fill="#FFFFFF" opacity="0.75"/>
  `;
}

// ─── SVG builders ────────────────────────────────────────────────────────────

function squircleSvg(size) {
  const r = size * 0.2237;
  const scale = size / 200;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <clipPath id="squircle">
        <rect x="0" y="0" width="${size}" height="${size}" rx="${r.toFixed(2)}" ry="${r.toFixed(2)}"/>
      </clipPath>
    </defs>
    <g clip-path="url(#squircle)">
      <g transform="scale(${scale})">
        ${iconArt({ showBg: true })}
      </g>
    </g>
  </svg>`;
}

function splashIconSvg(size) {
  const scale = size / 200;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <g transform="scale(${scale})">
      ${iconArt({ showBg: false })}
    </g>
  </svg>`;
}

function foregroundSvg(size) {
  const scale = size / 200;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <g transform="scale(${scale})">
      ${iconArt({ showBg: false })}
    </g>
  </svg>`;
}

function backgroundSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="${C.tileBg1}"/>
        <stop offset="60%"  stop-color="${C.tileBg2}"/>
        <stop offset="100%" stop-color="${C.tileBg3}"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="${size}" height="${size}" fill="url(#bg)"/>
  </svg>`;
}

function monochromeSvg(size) {
  const scale = size / 200;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <g transform="scale(${scale})">
      ${iconArt({ showBg: false, monochrome: true })}
    </g>
  </svg>`;
}

// ─── Render helpers ──────────────────────────────────────────────────────────

function render(svg, outPath) {
  const resvg = new Resvg(svg, { background: 'transparent' });
  const png = resvg.render().asPng();
  writeFileSync(outPath, png);
  console.log(`  ✓ ${outPath.replace(process.cwd(), '.')}`);
}

// ─── Generate all assets ─────────────────────────────────────────────────────

console.log('Generating weather brand assets (classic variant)…\n');

render(squircleSvg(1024),     `${OUT}/icon.png`);
render(splashIconSvg(512),    `${OUT}/splash-icon.png`);
render(foregroundSvg(1024),   `${OUT}/android-icon-foreground.png`);
render(backgroundSvg(1024),   `${OUT}/android-icon-background.png`);
render(monochromeSvg(1024),   `${OUT}/android-icon-monochrome.png`);
render(squircleSvg(64),       `${OUT}/favicon.png`);

console.log('\nDone.');
