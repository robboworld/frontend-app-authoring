/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution (course files catalog). See NOTICE at repository root.
 *
 * The «Файлы» catalog: automatic groups computed from where each file is used
 * (usage locations from robbo_asset_usage.py) plus author folders (`robboFolder` label).
 * Nothing here is stored: the tree is rebuilt from the loaded file list.
 */
import type { UsageLocation } from './usageText';

export interface CatalogAsset {
  id: string;
  displayName?: string;
  usageLocations?: UsageLocation[];
  robboFolder?: string;
}

export type CatalogNodeKind = 'group' | 'section' | 'subsection' | 'unit' | 'folder';

export interface CatalogNode {
  id: string;
  kind: CatalogNodeKind;
  /** Message key for fixed groups, literal text for outline nodes and folders. */
  label: string;
  count: number;
  position: number;
  pending?: boolean;
  children: CatalogNode[];
}

export const NODE_ALL = 'all';
export const NODE_DESIGN = 'design';
export const NODE_CERTIFICATE = 'certificate';
export const NODE_PAGES = 'pages';
export const NODE_SETTINGS = 'settings';
export const NODE_STRUCTURE = 'structure';
export const NODE_FOLDERS = 'folders';
export const NODE_NO_FOLDER = 'no-folder';
export const NODE_UNUSED = 'unused';

const FOLDER_PREFIX = 'folder:';
const OUTLINE_PREFIXES = { section: 'section:', subsection: 'subsection:', unit: 'unit:' } as const;

/** Usage kinds (robbo.kind) of each fixed group. */
const GROUP_KINDS: Record<string, string[]> = {
  [NODE_DESIGN]: ['course_image', 'banner_image', 'video_thumbnail', 'about'],
  [NODE_CERTIFICATE]: ['certificate'],
  [NODE_PAGES]: ['textbook', 'page', 'updates', 'handouts'],
  [NODE_SETTINGS]: ['course_settings'],
};

export const folderNodeId = (folder: string) => `${FOLDER_PREFIX}${folder}`;
export const folderFromNodeId = (nodeId: string | null | undefined): string | null => (
  nodeId?.startsWith(FOLDER_PREFIX) ? nodeId.slice(FOLDER_PREFIX.length) : null
);

const usageKinds = (asset: CatalogAsset) => (asset.usageLocations || []).map(location => location.robbo?.kind);

/** Outline node ids (section/subsection/unit) a file is used in. */
const outlineIds = (asset: CatalogAsset): Set<string> => {
  const ids = new Set<string>();
  (asset.usageLocations || []).forEach(location => {
    const path = location.robbo?.kind === 'block' ? location.robbo.path : null;
    if (!path?.length) {
      return;
    }
    (['section', 'subsection', 'unit'] as const).forEach((kind, depth) => {
      if (path[depth]) {
        ids.add(`${OUTLINE_PREFIXES[kind]}${path[depth].id}`);
      }
    });
  });
  return ids;
};

export const isUnused = (asset: CatalogAsset) => !asset.usageLocations?.length;

/** Does `asset` belong to the catalog node `nodeId`? */
export const nodeMatches = (asset: CatalogAsset, nodeId: string): boolean => {
  if (!nodeId || nodeId === NODE_ALL) {
    return true;
  }
  if (GROUP_KINDS[nodeId]) {
    const kinds = usageKinds(asset);
    return GROUP_KINDS[nodeId].some(kind => kinds.includes(kind));
  }
  if (nodeId === NODE_STRUCTURE) {
    return usageKinds(asset).includes('block');
  }
  if (nodeId === NODE_UNUSED) {
    return isUnused(asset);
  }
  if (nodeId === NODE_FOLDERS) {
    return !!asset.robboFolder;
  }
  if (nodeId === NODE_NO_FOLDER) {
    return !asset.robboFolder;
  }
  const folder = folderFromNodeId(nodeId);
  if (folder !== null) {
    return (asset.robboFolder || '') === folder;
  }
  return outlineIds(asset).has(nodeId);
};

const sortNodes = (nodes: CatalogNode[]) => {
  nodes.sort((a, b) => a.position - b.position || a.label.localeCompare(b.label, 'ru'));
  nodes.forEach(node => sortNodes(node.children));
  return nodes;
};

/** Course outline tree (section → subsection → unit) of the files used in blocks. */
const buildOutline = (assets: CatalogAsset[]): CatalogNode[] => {
  const nodes = new Map<string, CatalogNode & { assetIds: Set<string> }>();
  const roots: CatalogNode[] = [];
  assets.forEach(asset => {
    (asset.usageLocations || []).forEach(location => {
      const path = location.robbo?.kind === 'block' ? location.robbo.path : null;
      if (!path?.length) {
        return;
      }
      let parent: (CatalogNode & { assetIds: Set<string> }) | null = null;
      (['section', 'subsection', 'unit'] as const).forEach((kind, depth) => {
        const step = path[depth];
        if (!step) {
          return;
        }
        const id = `${OUTLINE_PREFIXES[kind]}${step.id}`;
        let node = nodes.get(id);
        if (!node) {
          node = { id, kind, label: step.name, count: 0, position: step.position, children: [], assetIds: new Set() };
          nodes.set(id, node);
          (parent ? parent.children : roots).push(node);
        }
        node.assetIds.add(asset.id);
        node.count = node.assetIds.size;
        parent = node;
      });
    });
  });
  return sortNodes(roots);
};

const countOf = (assets: CatalogAsset[], nodeId: string) => assets.filter(asset => nodeMatches(asset, nodeId)).length;

/**
 * The whole tree. Empty automatic groups are left out; folders come from the files
 * plus `pendingFolders` (created in this browser, still empty).
 */
export const buildCatalog = (assets: CatalogAsset[], pendingFolders: string[] = []): CatalogNode[] => {
  const group = (id: string, children: CatalogNode[] = []): CatalogNode => ({
    id, kind: 'group', label: id, count: countOf(assets, id), position: 0, children,
  });
  const tree: CatalogNode[] = [group(NODE_ALL)];
  [NODE_DESIGN, NODE_CERTIFICATE, NODE_PAGES, NODE_SETTINGS].forEach(id => {
    const node = group(id);
    if (node.count) {
      tree.push(node);
    }
  });

  const outline = buildOutline(assets);
  if (outline.length) {
    tree.push(group(NODE_STRUCTURE, outline));
  }

  const folderCounts = new Map<string, number>();
  assets.forEach(asset => {
    if (asset.robboFolder) {
      folderCounts.set(asset.robboFolder, (folderCounts.get(asset.robboFolder) || 0) + 1);
    }
  });
  pendingFolders.forEach(folder => {
    if (!folderCounts.has(folder)) {
      folderCounts.set(folder, 0);
    }
  });
  const folders = sortNodes([...folderCounts.entries()].map(([folder, count]) => ({
    id: folderNodeId(folder),
    kind: 'folder' as const,
    label: folder,
    count,
    position: 0,
    pending: count === 0,
    children: [],
  })));
  if (folders.some(node => !node.pending)) {
    folders.push({ ...group(NODE_NO_FOLDER), position: Number.MAX_SAFE_INTEGER });
  }
  tree.push({ ...group(NODE_FOLDERS, folders), count: countOf(assets, NODE_FOLDERS) });

  const unused = group(NODE_UNUSED);
  if (unused.count) {
    tree.push(unused);
  }
  return tree;
};

/** All folder names (with files or pending), for the move dialog and name validation. */
export const folderNames = (tree: CatalogNode[]): string[] => (
  tree.find(node => node.id === NODE_FOLDERS)?.children
    .filter(node => node.kind === 'folder')
    .map(node => node.label) || []
);

/** Ids of the nodes from the root down to `nodeId` (to expand them), or `[]` if absent. */
export const pathToNode = (tree: CatalogNode[], nodeId: string): string[] => {
  let found: string[] = [];
  tree.some(node => {
    if (node.id === nodeId) {
      found = [node.id];
      return true;
    }
    const below = pathToNode(node.children, nodeId);
    if (below.length) {
      found = [node.id, ...below];
      return true;
    }
    return false;
  });
  return found;
};

/** Flat list for the narrow-screen select: `[node, depth]`. */
export const flattenCatalog = (tree: CatalogNode[], depth = 0): [CatalogNode, number][] => (
  tree.flatMap(node => [[node, depth] as [CatalogNode, number], ...flattenCatalog(node.children, depth + 1)])
);

// Empty folders created in this browser (no file carries the label yet).
const pendingKey = (courseId: string) => `robbo.files.pendingFolders.${courseId}`;

export const loadPendingFolders = (courseId: string): string[] => {
  try {
    const value = JSON.parse(window.localStorage.getItem(pendingKey(courseId)) || '[]');
    return Array.isArray(value) ? value.filter(item => typeof item === 'string' && item) : [];
  } catch {
    return [];
  }
};

export const savePendingFolders = (courseId: string, folders: string[]) => {
  try {
    if (folders.length) {
      window.localStorage.setItem(pendingKey(courseId), JSON.stringify(folders));
    } else {
      window.localStorage.removeItem(pendingKey(courseId));
    }
  } catch {
    // Private mode or blocked storage: pending folders live until the page reloads.
  }
};

/** Same rules as robbo_asset_folders.normalize_folder on the server. */
export const normalizeFolderName = (name: string) => (
  Array.from(name.normalize('NFC'))
    .map(char => (char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127 ? ' ' : char))
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
    .trim()
);
