import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnExportCsv = jest.fn();
  const mockOnBackupToFile = jest.fn();
  const mockOnRestoreFromFile = jest.fn();
  const mockOnDeleteAll = jest.fn();
  const mockOnOpenTemplateModal = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders header elements correctly', () => {
    render(
      <Header
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onExportCsv={mockOnExportCsv}
        onBackupToFile={mockOnBackupToFile}
        onRestoreFromFile={mockOnRestoreFromFile}
        onDeleteAll={mockOnDeleteAll}
        onOpenTemplateModal={mockOnOpenTemplateModal}
      />
    );

    expect(screen.getByText('ワーク記録アプリ')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ワーク名、テーマ、メモで検索...')).toBeInTheDocument();
    expect(screen.getByText('メニュー')).toBeInTheDocument();
  });

  test('calls onSearchChange when search input changes', () => {
    render(
      <Header
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onExportCsv={mockOnExportCsv}
        onBackupToFile={mockOnBackupToFile}
        onRestoreFromFile={mockOnRestoreFromFile}
        onDeleteAll={mockOnDeleteAll}
        onOpenTemplateModal={mockOnOpenTemplateModal}
      />
    );

    const searchInput = screen.getByPlaceholderText('ワーク名、テーマ、メモで検索...');
    fireEvent.change(searchInput, { target: { value: 'テスト' } });

    expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
    expect(mockOnSearchChange).toHaveBeenCalledWith('テスト');
  });
});