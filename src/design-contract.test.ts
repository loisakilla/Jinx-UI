// @vitest-environment node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const readProjectFile = (path: string) => readFileSync(resolve(root, path), 'utf-8');

const indexHtml = readProjectFile('index.html');
const mainTsx = readProjectFile('src/main.tsx');
const showcaseApp = readProjectFile('src/showcase/App.tsx');
const showcaseSpecimen = readProjectFile('src/showcase/Specimen.tsx');
const tokensCss = readProjectFile('packages/tokens/src/index.css');
const tailwindCss = readProjectFile('packages/tokens/src/tailwind.css');
const coreCss = readProjectFile('packages/core/src/index.css');
const coreApp = readProjectFile('packages/core/src/jinx-app.css');
const coreSkins = readProjectFile('packages/core/src/jinx-skins.css');
const corePackageJson = readProjectFile('packages/core/package.json');
const reactPackageJson = readProjectFile('packages/react/package.json');
const reactRuntime = readProjectFile('packages/react/src/runtime.ts');
const reactIndex = readProjectFile('packages/react/src/index.ts');
const tokensPackageJson = readProjectFile('packages/tokens/package.json');
const rootPackageJson = readProjectFile('package.json');
const readme = readProjectFile('README.md');
const reactPackageReadme = readProjectFile('packages/react/README.md');
const docFiles = {
  'README.md': readme,
  'packages/tokens/README.md': readProjectFile('packages/tokens/README.md'),
  'packages/core/README.md': readProjectFile('packages/core/README.md'),
  'packages/react/README.md': reactPackageReadme,
  'docs/testing.md': readProjectFile('docs/testing.md'),
  'docs/components.md': readProjectFile('docs/components.md'),
  'docs/design-contract.md': readProjectFile('docs/design-contract.md'),
  'docs/security.md': readProjectFile('docs/security.md'),
};
const viteConfig = readProjectFile('vite.config.ts');
const ciWorkflow = readProjectFile('.github/workflows/ci.yml');

const indexDom = new JSDOM(indexHtml);
const indexDoc = indexDom.window.document;

const RUNTIME_EXPORTS = [
  'JxButton',
  'JxInputField',
  'JxTextareaField',
  'JxSelect',
  'JxCombobox',
  'JxTabs',
  'JxToggle',
  'JxAccordion',
  'JxModal',
  'JxDrawer',
  'JxToast',
  'JxToastViewport',
  'useJxToastQueue',
  'JxBadge',
  'JxChip',
  'JxTagInput',
  'JxAlert',
  'JxSwitch',
  'JxCheckbox',
  'JxRadio',
  'JxAvatar',
  'JxAvatarStack',
  'JxSlider',
  'JxProgress',
  'JxProgressCircle',
  'JxTooltip',
  'JxKbd',
  'JxTable',
  'JxMenu',
  'JxBreadcrumbs',
  'JxPagination',
  'JxStepper',
  'JxSkeleton',
  'JxSpinner',
  'JxEmptyState',
  'JxCalendar',
  'JxDivider',
  'JxSnippet',
  'JxSnip',
  'useDialogA11y',
  'useControllableState'
];

describe('Jinx UI design contract', () => {
  it('serves a thin TSX-mounted shell as the entry html', () => {
    expect(indexDoc.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(indexDoc.documentElement.getAttribute('data-style')).toBe('brutal');
    expect(indexDoc.getElementById('app')).toBeTruthy();
    expect(indexHtml).toContain('/src/main.tsx');
    expect(indexHtml).not.toContain('<style>');
    expect(indexHtml).not.toContain('window.JINX_TWEAKS');
    expect(indexHtml).not.toContain('jx-spec-row');
    expect(mainTsx).toContain("import '@jinx-ui/core';");
    expect(mainTsx).toContain("createRoot(rootNode).render(<App />");
  });

  it('keeps the brutal default and three-mode radius contract in tokens', () => {
    expect(tokensCss).toContain('[data-style="brutal"]');
    expect(tokensCss).toMatch(/\[data-style="brutal"\][^}]*--jx-r:\s*4px/);
    expect(tokensCss).toContain('[data-style="glass"]');
    expect(tokensCss).toContain('[data-style="minimal"]');
    expect(tokensCss).toMatch(/\[data-style="glass"\][^}]*--jx-r:\s*14px/);
    expect(coreSkins).toContain('[data-style="brutal"]');
    expect(coreSkins).toContain('--jx-r:      4px;');
    expect(coreSkins).toContain('[data-style="glass"]');
    expect(coreSkins).toContain('[data-style="minimal"]');
    expect(tailwindCss).toContain('--radius-jx:');
  });

  it('states the same component count in the runtime, the showcase and the README', () => {
    const components = RUNTIME_EXPORTS.filter((name) => name.startsWith('Jx')).length;
    const hooks = RUNTIME_EXPORTS.filter((name) => name.startsWith('use')).length;

    expect(showcaseApp).toContain("Object.keys(JinxRuntime).filter((name) => name.startsWith('Jx')).length");
    expect(showcaseApp).toContain('{COMPONENT_COUNT}<small>components</small>');
    expect(showcaseApp).not.toMatch(/\d+ React components/);

    [readme, reactPackageReadme].forEach((text) => {
      const claimed = text.match(/(\d+) components and (\d+) hooks/);
      expect(claimed, 'the README should state the component and hook count').toBeTruthy();
      expect(Number(claimed?.[1])).toBe(components);
      expect(Number(claimed?.[2])).toBe(hooks);
    });
    expect(reactPackageReadme).not.toContain('core 8');
  });

  it('renders every exported component somewhere in the specimen', () => {
    RUNTIME_EXPORTS.filter((name) => name.startsWith('Jx')).forEach((name) => {
      expect(showcaseSpecimen.includes(`<${name}`), `${name} is exported but never rendered in the specimen`).toBe(true);
    });
  });

  it('keeps the three packages publishable', () => {
    const manifests = {
      tokens: JSON.parse(tokensPackageJson),
      core: JSON.parse(corePackageJson),
      react: JSON.parse(reactPackageJson),
    };
    Object.entries(manifests).forEach(([name, manifest]) => {
      expect(manifest.private, `${name} must not be private once it is meant to ship`).toBeUndefined();
      expect(manifest.license).toBe('MIT');
      expect(manifest.description, `${name} needs a description for the npm page`).toBeTruthy();
      expect(manifest.repository?.directory, `${name} needs repository.directory`).toBe(`packages/${name}`);
      expect(manifest.publishConfig?.access, `${name} is scoped and needs public access`).toBe('public');
      expect(manifest.files, `${name} needs a files allowlist`).toContain('LICENSE');
      expect(existsSync(resolve(root, `packages/${name}/LICENSE`)), `packages/${name}/LICENSE is missing`).toBe(true);
    });

    expect(manifests.react.files).toEqual(['dist', 'README.md', 'LICENSE']);
    expect(manifests.react.exports['.'].types).toBe('./dist/index.d.ts');
    expect(manifests.react.exports['./runtime'].default).toBe('./dist/runtime.js');
    expect(manifests.react.scripts.prepare).toBe('npm run build');
    expect(JSON.stringify(manifests.react.exports)).not.toContain('src/');
  });

  it('says the packages are not on npm yet, everywhere a visitor would look', () => {
    expect(showcaseApp).not.toMatch(/npm i(nstall)?\s+@jinx-ui/);
    expect(readme).not.toMatch(/npm i(nstall)?\s+@jinx-ui/);
    expect(showcaseApp).toContain('Not on npm');
    expect(readme).toContain('Not on npm');
    expect(readme).toContain('https://jinx-ui.vercel.app');
  });

  it('keeps docs free of personal paths and the README free of removed files', () => {
    Object.entries(docFiles).forEach(([name, content]) => {
      expect(content.includes('C:\\'), `${name} points at a path on someone's machine`).toBe(false);
    });
    ['react-demo.html', 'workspace-brutal.html', 'jinx-preset.css', 'jinx-tailwind.css', 'src/jinx-app.js', 'core 8'].forEach((removed) => {
      expect(readme.includes(removed), `README still describes ${removed}`).toBe(false);
    });
  });

  it('declares design tokens in one place only', () => {
    const declared = (css: string) => new Set([...css.matchAll(/^\s*(--jx-[a-z0-9-]+):/gm)].map((match) => match[1]));
    const inTokens = declared(tokensCss);
    expect(inTokens.size).toBeGreaterThan(30);
    [...declared(coreApp)].forEach((token) => {
      expect(inTokens.has(token), `${token} is declared in jinx-app.css and shadows the tokens package`).toBe(false);
    });
  });

  it('keeps text and status colours readable in every theme and skin', () => {
    const block = (css: string, selector: string) => {
      const start = css.indexOf(`${selector} {`);
      if (start === -1) return {};
      const body = css.slice(start + selector.length + 2, css.indexOf('}', start));
      return Object.fromEntries([...body.matchAll(/(--jx-[a-z0-9-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
    };
    const base = { ...block(tokensCss, ':root,\n[data-theme="dark"]'), ...block(tokensCss, ':root') };
    const light = block(tokensCss, '[data-theme="light"]');
    const brutal = block(coreSkins, '[data-style="brutal"]');
    const brutalDark = block(coreSkins, '[data-style="brutal"][data-theme="dark"]');

    const channel = (value: number) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    const luminance = (hex: string) => {
      const full = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
      const [red, green, blue] = [1, 3, 5].map((offset) => channel(Number.parseInt(full.slice(offset, offset + 2), 16) / 255));
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const contrast = (a: string, b: string) => {
      const first = luminance(a);
      const second = luminance(b);
      return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
    };

    const combinations = {
      dark: base,
      light: { ...base, ...light },
      'brutal light': { ...base, ...light, ...brutal },
      'brutal dark': { ...base, ...brutal, ...brutalDark },
    };
    const readable = ['--jx-text', '--jx-text-2', '--jx-text-3', '--jx-success', '--jx-warning', '--jx-danger', '--jx-info'];

    Object.entries(combinations).forEach(([name, tokens]) => {
      const surfaces = [tokens['--jx-bg'], tokens['--jx-surface']].filter((value) => value?.startsWith('#'));
      expect(surfaces.length, `${name} has no surfaces to measure against`).toBe(2);
      readable.forEach((token) => {
        const value = tokens[token];
        if (!value?.startsWith('#')) return;
        surfaces.forEach((surface) => {
          expect(contrast(value, surface), `${token} on ${surface} in ${name}`).toBeGreaterThanOrEqual(4.5);
        });
      });
    });
  });

  it('keeps status colours readable on the light theme', () => {
    const lightBlock = tokensCss.match(/\[data-theme="light"\]\s*\{([^}]*)\}/)?.[1] ?? '';
    const channel = (value: number) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    const contrastOnWhite = (hex: string) => {
      const [red, green, blue] = [1, 3, 5].map((offset) => channel(Number.parseInt(hex.slice(offset, offset + 2), 16) / 255));
      return 1.05 / (0.2126 * red + 0.7152 * green + 0.0722 * blue + 0.05);
    };
    ['--jx-success', '--jx-warning', '--jx-danger', '--jx-info'].forEach((token) => {
      const value = lightBlock.match(new RegExp(`${token}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
      expect(value, `${token} needs a light-theme value`).toBeTruthy();
      expect(contrastOnWhite(value as string), `${token} must reach 4.5:1 on white`).toBeGreaterThanOrEqual(4.5);
    });
  });

  it('makes every skin that repaints a component repaint its states too', () => {
    const contract: Array<{ base: string; states: string[] }> = [
      { base: '\\.jx-chip(?![\\w-])', states: ['\\.jx-chip--active'] },
      { base: '\\.jx-badge(?![\\w-])', states: ['\\.jx-badge--solid', '\\.jx-badge--alt'] },
      { base: '\\.jx-tab\\[aria-selected="true"\\]', states: ['\\.jx-tabs--underline \\.jx-tab\\[aria-selected="true"\\]'] },
    ];
    const skins = [...new Set([...coreSkins.matchAll(/\[data-style="([a-z]+)"\]/g)].map((match) => match[1]))];
    expect(skins.length).toBeGreaterThan(1);

    contract.forEach(({ base, states }) => {
      skins.forEach((skin) => {
        const repaints = new RegExp(`\\[data-style="${skin}"\\]\\s+${base}`).test(coreSkins);
        if (!repaints) return;
        states.forEach((state) => {
          const covered = new RegExp(`\\[data-style="${skin}"\\]\\s+${state}`).test(coreSkins);
          expect(covered, `skin ${skin} repaints ${base} and must cover ${state} as well`).toBe(true);
        });
      });
    });
  });

  it('exposes a single @jinx-ui/core entry that ships tokens + skins together', () => {
    expect(coreCss).toContain('@import "@jinx-ui/tokens"');
    expect(coreCss).toContain('@import "./jinx-app.css"');
    expect(coreCss).toContain('@import "./jinx-skins.css"');
    expect(coreApp).toContain('.jx-btn');
    expect(coreApp).toContain('.jx-modal-frame');
    expect(coreApp).toContain('.jx-tabs');
    expect(coreApp).toContain('.jx-calendar');
    expect(coreApp).toContain('.jx-stepper');
    expect(coreApp).toContain('.jx-toast');
    expect(corePackageJson).toContain('"@jinx-ui/core"');
    expect(corePackageJson).toContain('"./src/index.css"');
    expect(corePackageJson).not.toContain('"./showcase"');
    expect(corePackageJson).not.toContain('primitives.css');
  });

  it('publishes the full TSX runtime surface via @jinx-ui/react/runtime', () => {
    expect(reactIndex).toContain("'use client';");
    expect(reactIndex).toContain("export * from './runtime';");
    expect(reactPackageJson).toContain('"framer-motion"');
    RUNTIME_EXPORTS.forEach((name) => {
      const exported = new RegExp(`export \\{[^}]*\\b${name}\\b[^}]*\\}`).test(reactRuntime);
      expect(exported, `runtime should export ${name}`).toBe(true);
    });
  });

  it('renders the 25-component specimen and the full showcase sections from TSX', () => {
    const rowMatches = showcaseSpecimen.match(/<Row\s/g) ?? [];
    expect(rowMatches.length).toBe(25);
    [
      'A · 01',
      'A · 06',
      'A · 13',
      'A · 19',
      'A · 25'
    ].forEach((tag) => {
      expect(showcaseSpecimen).toContain(tag);
    });
    expect(showcaseApp).toContain('Specimen');
    expect(showcaseApp).toContain('id="install"');
    expect(showcaseApp).toContain('id="doctrine"');
    expect(showcaseApp).toContain('id="jx-tweaks"');
    expect(showcaseApp).toContain('STYLE_MODES');
    expect(showcaseApp).toContain('framer-motion');
  });

  it('keeps build pipeline and CI gates aligned with single-entry TSX showcase', () => {
    expect(viteConfig).toContain("resolve(__dirname, 'index.html')");
    expect(viteConfig).not.toContain('reactDemo');
    expect(viteConfig).not.toContain('workspaceBrutal');
    expect(rootPackageJson).toContain('"verify"');
    expect(rootPackageJson).toContain('"framer-motion"');
    expect(ciWorkflow).toContain('npm run test');
    expect(ciWorkflow).toContain('npm run typecheck');
    expect(ciWorkflow).toContain('npm run build');
  });

  it('removes prototype host integration and unsafe HTML insertion APIs', () => {
    const shippedFiles = [indexHtml, mainTsx, showcaseApp, showcaseSpecimen, reactRuntime, coreApp];
    const shipped = shippedFiles.join('\n');
    expect(shipped).not.toContain('/cdn-cgi/');
    expect(shipped).not.toContain('postMessage');
    expect(shipped).not.toContain('dangerouslySetInnerHTML');
    expect(shipped).not.toContain('__edit_mode_available');
    expect(shipped).not.toContain('__edit_mode_set_keys');
    expect(shipped).not.toMatch(/\binnerHTML\b/);
    [
      'src/jinx-app.css',
      'src/jinx-app.js',
      'src/jinx-skins.css',
      'src/jinx-preset.css',
      'src/jinx-tailwind.css',
      'src/react-demo.tsx',
      'src/workspace-brutal.tsx',
      'react-demo.html',
      'workspace-brutal.html',
      'public/jinx-preset.css',
      'public/jinx-tailwind.css',
      'vite-dev.err.log',
      'vite-dev.out.log',
      'packages/core/src/primitives.css',
      'packages/core/src/primitives-skins.css',
      'packages/core/src/showcase.css'
    ].forEach((path) => {
      expect(existsSync(resolve(root, path))).toBe(false);
    });

    const trackedBuildOutput = execFileSync('git', ['ls-files', 'dist'], { cwd: root, encoding: 'utf-8' }).trim();
    expect(trackedBuildOutput).toBe('');
  });
});
