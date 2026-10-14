/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution (course files catalog). See NOTICE at repository root.
 *
 * Catalog navigation of «Файлы»: a tree on wide screens, a select on narrow ones.
 */
import React from 'react';
import classNames from 'classnames';
import type { IntlShape } from '@edx/frontend-platform/i18n';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Dropdown, Form, Icon, IconButton } from '@openedx/paragon';
import {
  ChevronRight,
  CreateNewFolder,
  ExpandMore,
  Folder,
  MoreVert,
} from '@openedx/paragon/icons';
import {
  type CatalogNode,
  flattenCatalog,
  NODE_ALL,
  NODE_CERTIFICATE,
  NODE_DESIGN,
  NODE_FOLDERS,
  NODE_NO_FOLDER,
  NODE_PAGES,
  NODE_SETTINGS,
  NODE_STRUCTURE,
  NODE_UNUSED,
} from './catalog';
import messages from './messages';

const GROUP_LABELS = {
  [NODE_ALL]: messages.nodeAll,
  [NODE_DESIGN]: messages.nodeDesign,
  [NODE_CERTIFICATE]: messages.nodeCertificate,
  [NODE_PAGES]: messages.nodePages,
  [NODE_SETTINGS]: messages.nodeSettings,
  [NODE_STRUCTURE]: messages.nodeStructure,
  [NODE_FOLDERS]: messages.nodeFolders,
  [NODE_NO_FOLDER]: messages.nodeNoFolder,
  [NODE_UNUSED]: messages.nodeUnused,
};

export const nodeLabel = (intl: IntlShape, node: CatalogNode): string => {
  if (node.kind === 'group') {
    return GROUP_LABELS[node.id] ? intl.formatMessage(GROUP_LABELS[node.id]) : node.label;
  }
  return node.label || intl.formatMessage(messages.nodeUntitled);
};

interface CatalogNavProps {
  tree: CatalogNode[];
  selectedId: string;
  onSelect: (nodeId: string) => void;
  canEdit: boolean;
  onNewFolder: () => void;
  onRenameFolder: (name: string) => void;
  onDeleteFolder: (name: string) => void;
}

interface CatalogTreeProps extends CatalogNavProps {
  expanded: Set<string>;
  onToggle: (nodeId: string) => void;
}

export const CatalogTree = ({
  tree,
  selectedId,
  onSelect,
  expanded,
  onToggle,
  canEdit,
  onNewFolder,
  onRenameFolder,
  onDeleteFolder,
}: CatalogTreeProps) => {
  const intl = useIntl();

  const renderNode = (node: CatalogNode) => {
    const label = nodeLabel(intl, node);
    const isFoldersGroup = node.id === NODE_FOLDERS;
    const hasChildren = node.children.length > 0 || (isFoldersGroup && canEdit);
    const isExpanded = expanded.has(node.id);
    const isSelected = node.id === selectedId;
    return (
      <li key={node.id} className={`robbo-files-tree__item robbo-files-tree__item--${node.kind}`}>
        <div className={classNames('robbo-files-tree__row', { 'is-selected': isSelected, 'is-pending': node.pending })}>
          {hasChildren ? (
            <IconButton
              className="robbo-files-tree__toggle"
              src={isExpanded ? ExpandMore : ChevronRight}
              iconAs={Icon}
              size="sm"
              variant="secondary"
              alt={intl.formatMessage(isExpanded ? messages.collapseNode : messages.expandNode, { name: label })}
              aria-expanded={isExpanded}
              onClick={() => onToggle(node.id)}
            />
          ) : (
            <span className="robbo-files-tree__toggle-spacer" aria-hidden />
          )}
          <button
            type="button"
            className="robbo-files-tree__label"
            aria-current={isSelected ? 'true' : undefined}
            onClick={() => onSelect(node.id)}
          >
            {node.kind === 'folder' && <Icon src={Folder} size="xs" className="robbo-files-tree__icon" />}
            <span className="robbo-files-tree__text">{label}</span>
            <span className="robbo-files-tree__count">{node.count}</span>
          </button>
          {node.kind === 'folder' && canEdit && (
            <Dropdown className="robbo-files-tree__menu">
              <Dropdown.Toggle
                id={`robbo-folder-menu-${node.id}`}
                as={IconButton}
                src={MoreVert}
                iconAs={Icon}
                size="sm"
                variant="secondary"
                alt={intl.formatMessage(messages.folderMenu, { name: label })}
              />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onRenameFolder(node.label)}>
                  {intl.formatMessage(messages.renameFolder)}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onDeleteFolder(node.label)}>
                  {intl.formatMessage(messages.deleteFolder)}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        {hasChildren && isExpanded && (
          <ul className="robbo-files-tree__children">
            {node.children.map(renderNode)}
            {isFoldersGroup && canEdit && (
              <li className="robbo-files-tree__item">
                <Button
                  variant="tertiary"
                  size="sm"
                  className="robbo-files-tree__new-folder"
                  iconBefore={CreateNewFolder}
                  onClick={onNewFolder}
                >
                  {intl.formatMessage(messages.newFolder)}
                </Button>
              </li>
            )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className="robbo-files-tree" aria-label={intl.formatMessage(messages.catalogNavLabel)}>
      <ul className="robbo-files-tree__root">{tree.map(renderNode)}</ul>
    </nav>
  );
};

const INDENT = '   ';

export const CatalogSelect = ({
  tree,
  selectedId,
  onSelect,
  canEdit,
  onNewFolder,
  onRenameFolder,
  onDeleteFolder,
}: CatalogNavProps) => {
  const intl = useIntl();
  const selected = flattenCatalog(tree).find(([node]) => node.id === selectedId)?.[0];
  return (
    <div className="robbo-files-catalog-select">
      <Form.Group className="robbo-files-catalog-select__field mb-0">
        <Form.Label>{intl.formatMessage(messages.catalogSelectLabel)}</Form.Label>
        <Form.Control as="select" value={selectedId} onChange={(event) => onSelect(event.target.value)}>
          {flattenCatalog(tree).map(([node, depth]) => (
            <option key={node.id} value={node.id}>
              {`${INDENT.repeat(depth)}${nodeLabel(intl, node)} (${node.count})`}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {canEdit && (
        <div className="robbo-files-catalog-select__actions">
          <Button variant="outline-primary" size="sm" iconBefore={CreateNewFolder} onClick={onNewFolder}>
            {intl.formatMessage(messages.newFolder)}
          </Button>
          {selected?.kind === 'folder' && (
            <>
              <Button variant="tertiary" size="sm" onClick={() => onRenameFolder(selected.label)}>
                {intl.formatMessage(messages.renameFolder)}
              </Button>
              <Button variant="tertiary" size="sm" onClick={() => onDeleteFolder(selected.label)}>
                {intl.formatMessage(messages.deleteFolder)}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
