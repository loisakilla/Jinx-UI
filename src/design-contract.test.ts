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
const rootPackageJson = readProjectFile('package.json');
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
  'JxSnip'
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
    expect(reactRuntime).toContain("export { useDialogA11y }");
    expect(reactRuntime).toContain("export { useControllableState }");
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
