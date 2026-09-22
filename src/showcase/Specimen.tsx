import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  JxAccordion,
  JxAlert,
  JxAvatar,
  JxAvatarStack,
  JxBadge,
  JxBreadcrumbs,
  JxButton,
  JxCalendar,
  JxCheckbox,
  JxChip,
  JxCombobox,
  JxDateRangePicker,
  JxDivider,
  JxDrawer,
  JxEmptyState,
  JxInputField,
  JxKbd,
  JxMenu,
  JxModal,
  JxPagination,
  JxPasswordField,
  JxProgress,
  JxProgressCircle,
  JxRadio,
  JxSelect,
  JxSkeleton,
  JxSlider,
  JxSnip,
  JxSnippet,
  JxSpinner,
  JxStepper,
  JxSwitch,
  JxTable,
  JxTabs,
  JxTagInput,
  JxTextareaField,
  JxToggle,
  JxToast,
  JxTooltip,
  useJxToastQueue,
  JxToastViewport
} from '@jinx-ui/react/runtime';
import type { JxToastVariant } from '@jinx-ui/react/runtime';

type RowProps = {
  tag: string;
  title: ReactNode;
  meta: string;
  bodyColumn?: boolean;
  children: ReactNode;
  bodyStyle?: React.CSSProperties;
};

function Row({ tag, title, meta, bodyColumn = false, children, bodyStyle }: RowProps) {
  return (
    <div className="jx-spec-row">
      <div className="jx-spec-label">
        <span className="jx-spec-tag">{tag}</span>
        <span className="jx-spec-name">{title}</span>
        <span className="jx-spec-meta">{meta}</span>
      </div>
      <div className={bodyColumn ? 'jx-spec-body jx-spec-body--col' : 'jx-spec-body'} style={bodyStyle}>
        {children}
      </div>
    </div>
  );
}

const settingsIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const bookmarkIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const shareIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);

const homeIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const checkIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const trashIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
  </svg>
);

const comboboxIcons = {
  button: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  input: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" />
    </svg>
  ),
  combobox: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-5-5" />
    </svg>
  ),
  slider: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  ),
  table: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
    </svg>
  ),
  toast: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6v6H9z" />
    </svg>
  )
};

const tableRows = [
  { name: 'Button', avatar: 'B', tone: 'accent' as const, version: '0.4.2', size: '1.2 kb', status: 'Stable', statusTone: 'success' as const, updated: '2d ago' },
  { name: 'Combobox', avatar: 'C', tone: 'info' as const, version: '0.4.2', size: '3.8 kb', status: 'New', statusTone: 'info' as const, updated: 'Today' },
  { name: 'DataGrid', avatar: 'D', tone: 'info' as const, version: '0.3.9', size: '8.4 kb', status: 'Beta', statusTone: 'warning' as const, updated: '1w ago' },
  { name: 'Toast', avatar: 'T', tone: 'default' as const, version: '0.4.2', size: '2.1 kb', status: 'Stable', statusTone: 'success' as const, updated: '5d ago' }
];

export function Specimen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [singleAcc, setSingleAcc] = useState<string[]>(['why']);
  const toasts = useJxToastQueue();

  const toastVariants: Array<{ key: JxToastVariant; label: string; title: string; message: string }> = [
    { key: 'default', label: 'Default', title: 'Build queued', message: 'Waiting for runner...' },
    { key: 'success', label: 'Success', title: 'Deployed', message: 'Build #4012 shipped in 42s' },
    { key: 'warning', label: 'Warning', title: 'Slow query detected', message: '/api/users took 2.4s' },
    { key: 'danger', label: 'Danger', title: 'Build failed', message: 'TypeError in useAccent.ts:42' }
  ];

  return (
    <section className="jx-section" id="specimen" data-screen-label="Specimen">
      <div className="jx-container">
        <div className="jx-section-head">
          <div className="jx-section-label" data-num="A.">Specimen</div>
          <h2>
            <em>27</em> rows — every component in the kit.
          </h2>
          <p>
            Each row demonstrates one primitive or a pair, shipped as React TSX. Every visual is driven by the jx-* namespace from @jinx-ui/core.
          </p>
        </div>

        <div className="jx-specimen-grid">
          <Row tag="A · 01" title={<><em>Button</em></>} meta="5 var · 3 sz">
            <JxButton variant="primary">Primary</JxButton>
            <JxButton variant="secondary">Secondary</JxButton>
            <JxButton variant="ghost">Ghost</JxButton>
            <JxButton variant="outline">Outline</JxButton>
            <JxButton variant="danger">Delete</JxButton>
            <JxButton variant="secondary" iconOnly aria-label="Settings">
              {settingsIcon}
            </JxButton>
            <JxButton variant="primary" disabled>Disabled</JxButton>
            <span className="jx-spec-divider">│</span>
            <JxButton variant="primary" size="sm">Ship</JxButton>
            <JxButton variant="primary">Ship it</JxButton>
            <JxButton variant="primary" size="lg">Ship it loudly</JxButton>
          </Row>

          <Row tag="A · 02" title={<><em>Input</em></>} meta="label · affix · error" bodyColumn>
            <JxInputField label="Email" required type="email" defaultValue="hello@jinx.dev" helperText="// we'll never share. pinky promise." />
            <JxInputField label="API key" prefix="sk_live_" placeholder="•••••••••••••••" />
            <JxInputField label="Username" defaultValue="$jinx_99" errorText="no special characters — letters & digits only" />
          </Row>

          <Row tag="A · 03" title={<><em>Password</em></>} meta="reveal · a11y" bodyColumn>
            <JxPasswordField label="Password" required defaultValue="hunter2-but-longer" helperText="// click the eye to reveal. 12 characters minimum." />
            <JxPasswordField label="Confirm password" defaultValue="hunter2" errorText="the two passwords do not match" />
          </Row>

          <Row tag="A · 04" title={<><em>Textarea</em></>} meta="resize · help" bodyColumn bodyStyle={{ maxWidth: 420 }}>
            <JxTextareaField
              label="Release notes"
              defaultValue="Adds <Combobox /> with async loading and 12 a11y fixes across form primitives."
              helperText="// markdown supported. be honest."
            />
          </Row>

          <Row tag="A · 05" title={<><em>Select</em></>} meta="custom · keyboard" bodyStyle={{ gap: 24, alignItems: 'flex-start' }}>
            <div style={{ width: 240 }}>
              <JxSelect
                label="Framework"
                defaultValue="r18"
                options={[
                  { value: 'r18', label: 'React 18', meta: 'latest', group: 'Stable' },
                  { value: 'r17', label: 'React 17', meta: 'legacy', group: 'Stable' },
                  { value: 'r19', label: 'React 19 (RC)', meta: 'canary', group: 'Experimental' }
                ]}
              />
            </div>
            <div style={{ width: 240 }}>
              <JxSelect
                label="Output format"
                defaultValue="css"
                options={[
                  { value: 'css', label: 'CSS variables' },
                  { value: 'tw', label: 'Tailwind v4 preset' },
                  { value: 'both', label: 'Both' }
                ]}
              />
            </div>
          </Row>

          <Row tag="A · 06" title={<><em>Combobox</em></>} meta="filter · async">
            <JxCombobox
              placeholder="Search components..."
              options={[
                { value: 'button', label: 'Button', subLabel: '1.2 kb', icon: comboboxIcons.button },
                { value: 'input', label: 'Input', subLabel: '0.9 kb', icon: comboboxIcons.input },
                { value: 'combobox', label: 'Combobox', subLabel: '3.8 kb', icon: comboboxIcons.combobox },
                { value: 'slider', label: 'Slider', subLabel: '1.1 kb', icon: comboboxIcons.slider },
                { value: 'table', label: 'Table', subLabel: '2.4 kb', icon: comboboxIcons.table },
                { value: 'toast', label: 'Toast', subLabel: '2.1 kb', icon: comboboxIcons.toast }
              ]}
            />
            <div style={{ fontFamily: 'var(--jx-font-mono)', fontSize: 11, color: 'var(--jx-text-3)', marginLeft: 12 }}>
              // type to filter
              <br />
              // ↑↓ to navigate
              <br />
              // ⏎ to select
            </div>
          </Row>

          <Row tag="A · 07" title={<><em>Badge</em> · Chip · Tag-input</>} meta="8 tones" bodyColumn>
            <div className="row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <JxBadge dot>Default</JxBadge>
              <JxBadge dot tone="accent">Active</JxBadge>
              <JxBadge dot tone="info">Beta</JxBadge>
              <JxBadge dot tone="success">Online</JxBadge>
              <JxBadge dot tone="warning">Idle</JxBadge>
              <JxBadge dot tone="danger">Down</JxBadge>
              <JxBadge tone="solid">v0.4.2</JxBadge>
            </div>
            <JxTagInput defaultValue={['react', 'typescript', 'tailwind v4']} />
          </Row>

          <Row tag="A · 08" title={<><em>Tabs</em> · Toggle</>} meta="segmented · underline">
            <JxTabs
              ariaLabel="Specimen segmented tabs"
              defaultValue="activity"
              items={[
                { value: 'overview', label: 'Overview' },
                { value: 'activity', label: 'Activity' },
                { value: 'settings', label: 'Settings' }
              ]}
            />
            <JxTabs
              variant="underline"
              ariaLabel="Specimen underline tabs"
              defaultValue="code"
              items={[
                { value: 'code', label: 'Code' },
                { value: 'preview', label: 'Preview' },
                { value: 'logs', label: 'Logs' }
              ]}
            />
            {/*<JxToggle
              defaultValue="day"
              items={[
                {
                  value: 'day',
                  label: (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                      Day
                    </>
                  )
                },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' }
              ]}
            />*/}
          </Row>

          <Row tag="A · 09" title={<><em>Alert</em></>} meta="4 intents" bodyColumn bodyStyle={{ maxWidth: 560 }}>
            <JxAlert intent="info" title="New release: v0.4.2">
              Adds <code>&lt;Combobox /&gt;</code>, fixes 12 a11y issues.
            </JxAlert>
            <JxAlert intent="success" title="Deployed to production">
              Committed by @aria · main@8f3c21
            </JxAlert>
            <JxAlert intent="warning" title="Rate limit at 87%">
              Resets in 14 minutes. Consider batching.
            </JxAlert>
            <JxAlert intent="danger" title="Build failed on staging">
              TypeError in <code>useAccent.ts:42</code>.
            </JxAlert>
          </Row>

          <Row tag="A · 10" title={<><em>Switch</em> · Check · Radio</>} meta="controlled" bodyStyle={{ gap: 24 }}>
            <JxSwitch label="Weekly digest" defaultChecked />
            <JxSwitch label="Beta features" />
            <span className="jx-spec-divider">│</span>
            <JxCheckbox label="Remember me" defaultChecked />
            <JxCheckbox label="Subscribe" />
            <span className="jx-spec-divider">│</span>
            <JxRadio name="spec-plan" label="Monthly" defaultChecked />
            <JxRadio name="spec-plan" label="Yearly" />
          </Row>

          <Row tag="A · 11" title={<><em>Avatar</em></>} meta="stack · status" bodyStyle={{ gap: 32 }}>
            <div className="row" style={{ display: 'flex', gap: 8 }}>
              <JxAvatar size="sm" tone="accent">JX</JxAvatar>
              <JxAvatar tone="accent">AR</JxAvatar>
              <JxAvatar size="lg" tone="info">VI</JxAvatar>
              <JxAvatar tone="info" status>KA</JxAvatar>
            </div>
            <JxAvatarStack>
              <JxAvatar tone="accent">AR</JxAvatar>
              <JxAvatar tone="accent">VI</JxAvatar>
              <JxAvatar tone="info">KA</JxAvatar>
              <JxAvatar style={{ background: 'var(--jx-surface-2)', color: 'var(--jx-text-2)' }}>+8</JxAvatar>
            </JxAvatarStack>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <JxAvatar size="sm" tone="accent">AR</JxAvatar>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Aria Chen</div>
                <div style={{ fontSize: 11, color: 'var(--jx-text-3)', fontFamily: 'var(--jx-font-mono)' }}>aria@jinx.dev</div>
              </div>
              <JxBadge dot tone="success">Online</JxBadge>
            </div>
          </Row>

          <Row tag="A · 12" title={<><em>Slider</em> · Progress</>} meta="range · linear · radial" bodyStyle={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 32, width: '100%', maxWidth: 720, alignItems: 'center' }}>
            <JxSlider label="Volume" defaultValue={72} />
            <div>
              <JxProgress value={48} label="Upload" />
              <div style={{ height: 14 }} />
              <JxProgress value={92} label="Sync" />
            </div>
            <JxProgressCircle value={67} />
          </Row>

          <Row tag="A · 13" title={<><em>Tooltip</em> · Kbd</>} meta="hover · focus" bodyStyle={{ gap: 24 }}>
            <JxTooltip tip="Save for later">
              <JxButton variant="secondary" iconOnly aria-label="Bookmark">{bookmarkIcon}</JxButton>
            </JxTooltip>
            <JxTooltip tip="Share link">
              <JxButton variant="secondary" iconOnly aria-label="Share">{shareIcon}</JxButton>
            </JxTooltip>
            <span className="jx-spec-divider">│</span>
            <div className="row" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <JxKbd>⌘</JxKbd>
              <JxKbd>⇧</JxKbd>
              <JxKbd>K</JxKbd>
              <span style={{ fontSize: 12, color: 'var(--jx-text-3)', marginLeft: 8 }}>Open palette</span>
            </div>
            <div className="row" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <JxKbd>esc</JxKbd>
              <span style={{ fontSize: 12, color: 'var(--jx-text-3)', marginLeft: 8 }}>Close dialog</span>
            </div>
          </Row>

          <Row tag="A · 14" title={<><em>Table</em></>} meta="hover · status" bodyColumn bodyStyle={{ maxWidth: 760 }}>
            <JxTable>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Ver.</th>
                  <th>Bundle</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Updated</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.name}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <JxAvatar size="sm" tone={row.tone === 'default' ? 'default' : row.tone} style={row.tone === 'default' ? { background: 'var(--jx-surface-3)' } : undefined}>
                        {row.avatar}
                      </JxAvatar>
                      <strong style={{ fontWeight: 600 }}>{row.name}</strong>
                    </td>
                    <td className="mono" style={{ color: 'var(--jx-text-3)' }}>{row.version}</td>
                    <td className="mono">{row.size}</td>
                    <td><JxBadge dot tone={row.statusTone}>{row.status}</JxBadge></td>
                    <td style={{ textAlign: 'right', color: 'var(--jx-text-3)' }}>{row.updated}</td>
                  </tr>
                ))}
              </tbody>
            </JxTable>
          </Row>

          <Row tag="A · 15" title={<><em>Menu</em></>} meta="overflow · context" bodyStyle={{ gap: 32, alignItems: 'flex-start' }}>
            <JxMenu
              items={[
                { type: 'label', label: 'Workspace' },
                { icon: homeIcon, label: 'Dashboard', shortcut: '⌘D' },
                { icon: checkIcon, label: 'Mark done', shortcut: '⌘.' },
                { icon: settingsIcon, label: 'Settings', shortcut: '⌘,' },
                { type: 'divider' },
                { icon: trashIcon, label: 'Delete workspace', shortcut: '⌘⌫', danger: true }
              ]}
            />
          </Row>

          <Row tag="A · 16" title={<><em>Modal</em></>} meta="destructive · confirm">
            <JxButton variant="secondary" onClick={() => setModalOpen(true)}>Open modal</JxButton>
            <JxModal
              open={modalOpen}
              onOpenChange={setModalOpen}
              title="Delete this workspace?"
              message="Forever. We can't restore it. Type the workspace name to confirm."
              intent="danger"
            >
              <JxButton variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</JxButton>
              <JxButton variant="danger" size="sm" onClick={() => setModalOpen(false)}>Delete</JxButton>
            </JxModal>
          </Row>

          <Row tag="A · 17" title={<><em>Drawer</em></>} meta="side-panel">
            <JxButton variant="outline" onClick={() => setDrawerOpen(true)}>Open drawer</JxButton>
            <JxDrawer open={drawerOpen} onOpenChange={setDrawerOpen} title="Filters">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <JxInputField label="Search" placeholder="By name…" />
                <div className="jx-field">
                  <label className="jx-label">Status</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <JxChip active>Stable</JxChip>
                    <JxChip>Beta</JxChip>
                    <JxChip>Draft</JxChip>
                  </div>
                </div>
                <JxSwitch label="Only deps under 5kb" defaultChecked />
                <JxButton variant="primary" onClick={() => setDrawerOpen(false)}>Apply filters</JxButton>
              </div>
            </JxDrawer>
          </Row>

          <Row tag="A · 18" title={<><em>Accordion</em></>} meta="single · multi" bodyColumn bodyStyle={{ maxWidth: 540 }}>
            <JxAccordion
              single
              value={singleAcc}
              onValueChange={setSingleAcc}
              items={[
                { value: 'why', title: 'Why another UI kit?', content: 'Because the existing ones either ship 200kb of runtime or refuse to let you change a single color without writing a plugin.' },
                { value: 'tree', title: 'Is it tree-shakeable?', content: 'Yes. Every component is a separate entry. Import only what you use; pay for only what you import.' },
                { value: 'rsc', title: 'Does it work with Server Components?', content: 'Most primitives are pure-style and render server-side. Interactive ones (Combobox, Menu) ship with the "use client" directive baked in.' }
              ]}
            />
          </Row>

          <Row tag="A · 19" title={<><em>Breadcrumbs</em> · Pagination</>} meta="navigation" bodyColumn>
            <JxBreadcrumbs
              items={[
                { label: 'Docs', href: '#' },
                { label: 'Components', href: '#' },
                { label: 'Forms', href: '#' },
                { label: 'Combobox' }
              ]}
            />
            <JxPagination total={12} defaultPage={2} />
          </Row>

          <Row tag="A · 20" title={<><em>Stepper</em></>} meta="progress · flow" bodyStyle={{ width: '100%', maxWidth: 680 }}>
            <JxStepper current={2} steps={[{ label: 'Account' }, { label: 'Workspace' }, { label: 'Theme' }, { label: 'Done' }]} />
          </Row>

          <Row tag="A · 21" title={<><em>Skeleton</em> · Spinner</>} meta="loading states" bodyStyle={{ gap: 28, alignItems: 'flex-start' }}>
            <div style={{ width: 280, display: 'flex', gap: 12 }}>
              <JxSkeleton circle width={44} height={44} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <JxSkeleton height={14} width="70%" style={{ marginBottom: 8 }} />
                <JxSkeleton height={10} width="50%" style={{ marginBottom: 8 }} />
                <JxSkeleton height={10} width="88%" />
              </div>
            </div>
            <span className="jx-spec-divider">│</span>
            <div className="row" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '8px 0' }}>
              <JxSpinner />
              <JxSpinner variant="dots" />
              <JxButton variant="primary" size="sm" disabled>
                <JxSpinner size={14} />
                Building...
              </JxButton>
            </div>
          </Row>

          <Row tag="A · 22" title={<><em>Toast</em></>} meta="click to fire ↗" bodyColumn>
            <div className="row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {toastVariants.map((variant) => (
                <JxButton
                  key={variant.key}
                  variant="secondary"
                  size="sm"
                  onClick={() => toasts.push({ title: variant.title, message: variant.message, variant: variant.key })}
                >
                  {variant.label}
                </JxButton>
              ))}
            </div>
            <div style={{ maxWidth: 360 }}>
              <JxToast title="Build queued" message="Waiting for runner #3 — eta 42s" />
            </div>
          </Row>

          <Row tag="A · 23" title={<><em>Empty</em> state</>} meta="no-data fallback" bodyStyle={{ width: '100%', maxWidth: 480 }}>
            <JxEmptyState
              title="No components match."
              message="Try fewer letters, or check the spelling."
              action={<JxButton variant="secondary" size="sm">Clear filters</JxButton>}
            />
          </Row>

          <Row tag="A · 24" title={<><em>Calendar</em></>} meta="date picker">
            <JxCalendar
              defaultValue={new Date(2026, 4, 18)}
              rangeHover={{ from: new Date(2026, 4, 13), to: new Date(2026, 4, 17) }}
            />
            <div style={{ fontFamily: 'var(--jx-font-mono)', fontSize: 11, color: 'var(--jx-text-3)', marginLeft: 12, maxWidth: 200 }}>
              // selected: May 18
              <br />
              // range hover: May 13–17
              <br />
              // today: May 19
            </div>
          </Row>

          <Row tag="A · 25" title={<><em>Date</em> range</>} meta="from · to · hover">
            <JxDateRangePicker defaultValue={{ from: new Date(2026, 4, 13), to: new Date(2026, 4, 17) }} />
            <div style={{ fontFamily: 'var(--jx-font-mono)', fontSize: 11, color: 'var(--jx-text-3)', marginLeft: 12, maxWidth: 200 }}>
              // click a day to start
              <br />
              // hover previews the span
              <br />
              // ←↑→↓ walks the grid
            </div>
          </Row>

          <Row tag="A · 26" title={<><em>Divider</em></>} meta="labeled · plain" bodyColumn bodyStyle={{ maxWidth: 480 }}>
            <JxDivider />
            <JxDivider label="section" />
            <JxDivider label="or continue with" />
          </Row>

          <Row tag="A · 27" title={<><em>Snippet</em> · Snip</>} meta="inline · block · copy" bodyColumn>
            <div className="row" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <JxSnippet prompt="$" copyText="git clone https://github.com/loisakilla/Jinx-UI.git">git clone jinx-ui</JxSnippet>
              <JxSnippet prompt="›">npm install</JxSnippet>
              <JxSnippet prompt="#" tone="info">npm run dev</JxSnippet>
            </div>
            <JxSnippet block style={{ width: '100%', maxWidth: 480 }}>
              {`import '@jinx-ui/core';\nimport { JxButton } from '@jinx-ui/react';\n\n<JxButton variant="primary">Ship it</JxButton>`}
            </JxSnippet>
            <p style={{ margin: 0 }}>
              Inline code inside a sentence uses <JxSnip>JxSnip</JxSnip>, which styles the text without the copy affordance.
            </p>
          </Row>
        </div>
      </div>

      <JxToastViewport items={toasts.items} onDismiss={toasts.dismiss} />
    </section>
  );
}
