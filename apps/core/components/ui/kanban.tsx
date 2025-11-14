/**
 * Kanban Board Component
 *
 * Componente de quadro Kanban com drag & drop para organização de tarefas.
 * Usa HTML5 Drag and Drop API para movimentação de cards entre colunas.
 *
 * @example
 * ```tsx
 * <KanbanBoard
 *   columns={[
 *     { id: 'todo', title: 'A Fazer', cards: [...] },
 *     { id: 'doing', title: 'Fazendo', cards: [...] }
 *   ]}
 *   onCardMove={(cardId, fromColumn, toColumn) => {}}
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { MoreVertical, Plus } from 'lucide-react';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  tags?: Array<{ label: string; color?: string }>;
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
  limit?: number;
}

export interface KanbanBoardProps {
  /**
   * Colunas do Kanban
   */
  columns: KanbanColumn[];

  /**
   * Callback quando card é movido
   */
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;

  /**
   * Callback quando card é clicado
   */
  onCardClick?: (card: KanbanCard) => void;

  /**
   * Callback para adicionar card
   */
  onAddCard?: (columnId: string) => void;

  /**
   * Se true, permite adicionar cards
   */
  showAddCard?: boolean;

  /**
   * Se true, mostra contador de cards
   */
  showCardCount?: boolean;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function KanbanBoard({
  columns,
  onCardMove,
  onCardClick,
  onAddCard,
  showAddCard = true,
  showCardCount = true,
  className,
}: KanbanBoardProps) {
  const [draggedCard, setDraggedCard] = React.useState<{
    cardId: string;
    columnId: string;
  } | null>(null);
  const [dragOverColumn, setDragOverColumn] = React.useState<string | null>(null);

  const handleDragStart = (
    e: React.DragEvent,
    cardId: string,
    columnId: string
  ) => {
    setDraggedCard({ cardId, columnId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedCard) return;

    const { cardId, columnId: fromColumnId } = draggedCard;

    // Não faz nada se soltar na mesma coluna
    if (fromColumnId === toColumnId) {
      setDraggedCard(null);
      return;
    }

    // Chama callback
    onCardMove?.(cardId, fromColumnId, toColumnId, 0);
    setDraggedCard(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          isDragOver={dragOverColumn === column.id}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onCardClick={onCardClick}
          onAddCard={onAddCard}
          showAddCard={showAddCard}
          showCardCount={showCardCount}
        />
      ))}
    </div>
  );
}

/**
 * KanbanColumn - Coluna individual do Kanban
 */
interface KanbanColumnProps {
  column: KanbanColumn;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent, cardId: string, columnId: string) => void;
  onDragOver: (e: React.DragEvent, columnId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragEnd: () => void;
  onCardClick?: (card: KanbanCard) => void;
  onAddCard?: (columnId: string) => void;
  showAddCard: boolean;
  showCardCount: boolean;
}

function KanbanColumn({
  column,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onCardClick,
  onAddCard,
  showAddCard,
  showCardCount,
}: KanbanColumnProps) {
  const isOverLimit = column.limit && column.cards.length >= column.limit;

  return (
    <div className="flex flex-col w-80 flex-shrink-0 bg-gray-100 rounded-lg">
      {/* Column header */}
      <div className="p-4 border-b border-gray-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {column.color && (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: column.color }}
              />
            )}
            <h3 className="text-sm font-semibold text-gray-900">
              {column.title}
            </h3>
          </div>

          {showCardCount && (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded',
                  isOverLimit
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-200 text-gray-700'
                )}
              >
                {column.cards.length}
                {column.limit && ` / ${column.limit}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cards container */}
      <div
        className={cn(
          'flex-1 p-3 space-y-3 overflow-y-auto min-h-[200px] transition-colors',
          isDragOver && 'bg-primary-50'
        )}
        onDragOver={(e) => onDragOver(e, column.id)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, column.id)}
      >
        {column.cards.map((card) => (
          <KanbanCardComponent
            key={card.id}
            card={card}
            columnId={column.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onCardClick}
          />
        ))}

        {column.cards.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            Nenhum card
          </div>
        )}
      </div>

      {/* Add card button */}
      {showAddCard && onAddCard && (
        <div className="p-3 border-t border-gray-300">
          <button
            onClick={() => onAddCard(column.id)}
            disabled={isOverLimit}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              isOverLimit
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-gray-700'
            )}
          >
            <Plus size={16} />
            Adicionar Card
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * KanbanCardComponent - Card individual
 */
interface KanbanCardComponentProps {
  card: KanbanCard;
  columnId: string;
  onDragStart: (e: React.DragEvent, cardId: string, columnId: string) => void;
  onDragEnd: () => void;
  onClick?: (card: KanbanCard) => void;
}

function KanbanCardComponent({
  card,
  columnId,
  onDragStart,
  onDragEnd,
  onClick,
}: KanbanCardComponentProps) {
  const priorityColors = {
    low: 'border-l-4 border-l-green-500',
    medium: 'border-l-4 border-l-yellow-500',
    high: 'border-l-4 border-l-red-500',
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id, columnId)}
      onDragEnd={onDragEnd}
      onClick={() => onClick?.(card)}
      className={cn(
        'p-4 bg-white rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow',
        card.priority && priorityColors[card.priority]
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900 flex-1 pr-2">
          {card.title}
        </h4>
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <MoreVertical size={14} className="text-gray-500" />
        </button>
      </div>

      {/* Description */}
      {card.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs rounded"
              style={{
                backgroundColor: tag.color || '#e5e7eb',
                color: tag.color ? '#000' : '#4b5563',
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Assignee */}
        {card.assignee && (
          <div className="flex items-center gap-2">
            {card.assignee.avatar ? (
              <img
                src={card.assignee.avatar}
                alt={card.assignee.name}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {card.assignee.name.charAt(0)}
              </div>
            )}
            <span className="text-xs text-gray-600">
              {card.assignee.name}
            </span>
          </div>
        )}

        {/* Due date */}
        {card.dueDate && (
          <span className="text-xs text-gray-500">{card.dueDate}</span>
        )}
      </div>
    </div>
  );
}

/**
 * SimpleKanban - Kanban simplificado (apenas texto)
 */
export interface SimpleKanbanCard {
  id: string;
  content: string;
}

export interface SimpleKanbanColumn {
  id: string;
  title: string;
  cards: SimpleKanbanCard[];
}

export interface SimpleKanbanProps {
  columns: SimpleKanbanColumn[];
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  className?: string;
}

export function SimpleKanban({
  columns,
  onCardMove,
  className,
}: SimpleKanbanProps) {
  const [draggedCard, setDraggedCard] = React.useState<{
    cardId: string;
    columnId: string;
  } | null>(null);
  const [dragOverColumn, setDragOverColumn] = React.useState<string | null>(null);

  const handleDragStart = (
    e: React.DragEvent,
    cardId: string,
    columnId: string
  ) => {
    setDraggedCard({ cardId, columnId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedCard) return;
    if (draggedCard.columnId === toColumnId) {
      setDraggedCard(null);
      return;
    }

    onCardMove?.(draggedCard.cardId, draggedCard.columnId, toColumnId);
    setDraggedCard(null);
  };

  return (
    <div className={cn('flex gap-4 overflow-x-auto', className)}>
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col w-64 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {column.title} ({column.cards.length})
          </h3>

          <div
            className={cn(
              'flex-1 p-3 space-y-2 bg-gray-100 rounded-lg min-h-[200px] transition-colors',
              dragOverColumn === column.id && 'bg-primary-50'
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverColumn(column.id);
            }}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {column.cards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                onDragEnd={() => setDraggedCard(null)}
                className="p-3 bg-white rounded shadow-sm cursor-move hover:shadow transition-shadow"
              >
                <p className="text-sm text-gray-900">{card.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * useKanban - Hook para gerenciar estado do Kanban
 */
export interface UseKanbanOptions {
  initialColumns: KanbanColumn[];
  onUpdate?: (columns: KanbanColumn[]) => void;
}

export function useKanban(options: UseKanbanOptions) {
  const { initialColumns, onUpdate } = options;

  const [columns, setColumns] = React.useState<KanbanColumn[]>(initialColumns);

  const moveCard = React.useCallback(
    (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number = 0) => {
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];

        // Encontra colunas de origem e destino
        const fromColumn = newColumns.find((c) => c.id === fromColumnId);
        const toColumn = newColumns.find((c) => c.id === toColumnId);

        if (!fromColumn || !toColumn) return prevColumns;

        // Remove card da coluna de origem
        const cardIndex = fromColumn.cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prevColumns;

        const [card] = fromColumn.cards.splice(cardIndex, 1);

        // Adiciona na coluna de destino
        toColumn.cards.splice(newIndex, 0, card);

        onUpdate?.(newColumns);
        return newColumns;
      });
    },
    [onUpdate]
  );

  const addCard = React.useCallback(
    (columnId: string, card: KanbanCard) => {
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        const column = newColumns.find((c) => c.id === columnId);

        if (!column) return prevColumns;

        column.cards.push(card);
        onUpdate?.(newColumns);
        return newColumns;
      });
    },
    [onUpdate]
  );

  const removeCard = React.useCallback(
    (columnId: string, cardId: string) => {
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        const column = newColumns.find((c) => c.id === columnId);

        if (!column) return prevColumns;

        column.cards = column.cards.filter((c) => c.id !== cardId);
        onUpdate?.(newColumns);
        return newColumns;
      });
    },
    [onUpdate]
  );

  const updateCard = React.useCallback(
    (columnId: string, cardId: string, updates: Partial<KanbanCard>) => {
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        const column = newColumns.find((c) => c.id === columnId);

        if (!column) return prevColumns;

        const card = column.cards.find((c) => c.id === cardId);
        if (!card) return prevColumns;

        Object.assign(card, updates);
        onUpdate?.(newColumns);
        return newColumns;
      });
    },
    [onUpdate]
  );

  return {
    columns,
    setColumns,
    moveCard,
    addCard,
    removeCard,
    updateCard,
  };
}
