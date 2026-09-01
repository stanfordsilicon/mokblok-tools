import type { KeyboardEvent } from 'react';

type ArrowKey = 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp';

const NAVIGATION_TARGET = '[data-review-navigation-target]';

export function shouldNavigateFromTextField(
  input: HTMLInputElement | HTMLTextAreaElement,
  key: string,
) {
  const { selectionStart, selectionEnd, value } = input;
  if (selectionStart == null || selectionEnd == null || selectionStart !== selectionEnd)
    return false;

  if (key === 'ArrowLeft') return selectionStart === 0;
  if (key === 'ArrowRight') return selectionEnd === value.length;

  if (key === 'ArrowUp' || key === 'ArrowDown') {
    if (input instanceof HTMLInputElement) return true;
    // Textareas keep their native vertical caret movement until the caret reaches the first/last line.
    if (key === 'ArrowUp') return value.lastIndexOf('\n', selectionStart - 1) === -1;
    return value.indexOf('\n', selectionEnd) === -1;
  }

  return false;
}

export function moveReviewTableFocus(event: KeyboardEvent<HTMLElement>) {
  if (event.defaultPrevented || !isArrowKey(event.key)) return false;

  const sourceCell = event.currentTarget.closest('td');
  const table = sourceCell?.closest('table');
  if (!sourceCell || !table) return false;

  const grid = getTableGrid(table);
  const rowIndex = Array.from(table.rows).indexOf(sourceCell.parentElement as HTMLTableRowElement);
  const columns = (grid[rowIndex] ?? [])
    .map((cell, columnIndex) => (cell === sourceCell ? columnIndex : -1))
    .filter((columnIndex) => columnIndex >= 0);
  if (columns.length === 0) return false;

  const destination = findDestination(grid, sourceCell, rowIndex, columns, event.key);
  const target = destination && getNavigationTarget(destination);
  if (!target) return false;

  event.preventDefault();
  target.focus();
  selectText(target);
  return true;
}

function getTableGrid(table: HTMLTableElement) {
  const grid: Array<Array<HTMLTableCellElement | undefined>> = [];

  Array.from(table.rows).forEach((row, rowIndex) => {
    const gridRow = (grid[rowIndex] ??= []);
    let columnIndex = 0;

    Array.from(row.cells).forEach((cell) => {
      while (gridRow[columnIndex]) columnIndex += 1;

      for (let rowOffset = 0; rowOffset < cell.rowSpan; rowOffset += 1) {
        const spannedRow = (grid[rowIndex + rowOffset] ??= []);
        for (let columnOffset = 0; columnOffset < cell.colSpan; columnOffset += 1) {
          spannedRow[columnIndex + columnOffset] = cell;
        }
      }
      columnIndex += cell.colSpan;
    });
  });

  return grid;
}

function findDestination(
  grid: Array<Array<HTMLTableCellElement | undefined>>,
  sourceCell: HTMLTableCellElement,
  rowIndex: number,
  columns: number[],
  key: ArrowKey,
) {
  const firstColumn = columns[0];
  const lastColumn = columns[columns.length - 1];

  if (key === 'ArrowLeft' || key === 'ArrowRight') {
    const step = key === 'ArrowLeft' ? -1 : 1;
    for (
      let column = key === 'ArrowLeft' ? firstColumn - 1 : lastColumn + 1;
      column >= 0 && column < (grid[rowIndex]?.length ?? 0);
      column += step
    ) {
      const cell = grid[rowIndex][column];
      if (cell && cell !== sourceCell && getNavigationTarget(cell)) return cell;
    }
    return undefined;
  }

  const step = key === 'ArrowUp' ? -1 : 1;
  for (let row = rowIndex + step; row >= 0 && row < grid.length; row += step) {
    const cells = new Set(
      columns
        .map((column) => grid[row]?.[column])
        .filter((cell): cell is HTMLTableCellElement => cell != null),
    );
    const destination = Array.from(cells).find(
      (cell) => cell !== sourceCell && getNavigationTarget(cell),
    );
    if (destination) return destination;
  }

  return undefined;
}

function getNavigationTarget(cell: HTMLTableCellElement) {
  const target = cell.querySelector<HTMLElement>(NAVIGATION_TARGET);
  if (!target || target.getClientRects().length === 0) return undefined;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    return target.disabled ? undefined : target;
  }
  return target;
}

function selectText(target: HTMLElement) {
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

  target.select();
}

function isArrowKey(key: string): key is ArrowKey {
  return key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp';
}
