/**
 * Timeline Component
 *
 * Componentes de linha do tempo para exibir eventos cronológicos,
 * histórico de atividades e processos com passos.
 *
 * @example
 * ```tsx
 * <Timeline>
 *   <TimelineItem
 *     title="Lead criado"
 *     description="João Silva criou um novo lead"
 *     time="Há 2 horas"
 *     icon={<Plus />}
 *   />
 * </Timeline>
 * ```
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';

export interface TimelineItemProps {
  /**
   * Título do evento
   */
  title: string;

  /**
   * Descrição do evento
   */
  description?: string;

  /**
   * Timestamp ou texto de data/hora
   */
  time?: string;

  /**
   * Ícone customizado
   */
  icon?: React.ReactNode;

  /**
   * Conteúdo adicional
   */
  children?: React.ReactNode;

  /**
   * Status do item
   */
  status?: 'default' | 'success' | 'warning' | 'error' | 'active';

  /**
   * Se true, é o último item (não mostra linha conectora)
   */
  isLast?: boolean;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function TimelineItem({
  title,
  description,
  time,
  icon,
  children,
  status = 'default',
  isLast = false,
  className,
}: TimelineItemProps) {
  const statusColors = {
    default: 'bg-gray-300 border-gray-400',
    success: 'bg-green-500 border-green-600',
    warning: 'bg-yellow-500 border-yellow-600',
    error: 'bg-red-500 border-red-600',
    active: 'bg-primary-500 border-primary-600',
  };

  const lineColors = {
    default: 'bg-gray-300',
    success: 'bg-green-300',
    warning: 'bg-yellow-300',
    error: 'bg-red-300',
    active: 'bg-primary-300',
  };

  return (
    <div className={cn('relative flex gap-4 pb-8', className)}>
      {/* Icon column */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Icon circle */}
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 border-2 rounded-full z-10',
            statusColors[status]
          )}
        >
          {icon ? (
            <div className="text-white">{icon}</div>
          ) : (
            <div className="w-2 h-2 bg-white rounded-full" />
          )}
        </div>

        {/* Connecting line */}
        {!isLast && (
          <div className={cn('w-0.5 flex-1 mt-1', lineColors[status])} />
        )}
      </div>

      {/* Content column */}
      <div className="flex-1 pt-0.5">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          {time && <span className="text-xs text-gray-500 flex-shrink-0">{time}</span>}
        </div>

        {description && (
          <p className="text-sm text-gray-600 mb-2">{description}</p>
        )}

        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}

/**
 * Timeline - Container para TimelineItems
 */
export interface TimelineProps {
  /**
   * Items da timeline
   */
  children: React.ReactNode;

  /**
   * Orientação
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function Timeline({
  children,
  orientation = 'vertical',
  className,
}: TimelineProps) {
  if (orientation === 'horizontal') {
    return (
      <div className={cn('flex gap-8 overflow-x-auto pb-4', className)}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              isLast: index === React.Children.count(children) - 1,
              className: cn(child.props.className, 'flex-shrink-0 w-64'),
            });
          }
          return child;
        })}
      </div>
    );
  }

  return (
    <div className={cn('space-y-0', className)}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isLast: index === React.Children.count(children) - 1,
          });
        }
        return child;
      })}
    </div>
  );
}

/**
 * ActivityTimeline - Timeline para feed de atividades
 */
export interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ActivityTimelineProps {
  activities: Activity[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function ActivityTimeline({
  activities,
  loading = false,
  emptyMessage = 'Nenhuma atividade ainda',
  className,
}: ActivityTimelineProps) {
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <Timeline className={className}>
      {activities.map((activity, index) => (
        <TimelineItem
          key={activity.id}
          title={
            <span>
              <strong>{activity.user.name}</strong> {activity.action}
              {activity.target && (
                <span className="text-primary-600"> {activity.target}</span>
              )}
            </span>
          }
          time={activity.timestamp}
          icon={
            activity.user.avatar ? (
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {activity.user.name.charAt(0)}
              </div>
            )
          }
          isLast={index === activities.length - 1}
        >
          {activity.metadata && (
            <div className="text-xs text-gray-500">
              {Object.entries(activity.metadata).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {String(value)}
                </div>
              ))}
            </div>
          )}
        </TimelineItem>
      ))}
    </Timeline>
  );
}

/**
 * StepTimeline - Timeline para processos com passos
 */
export interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
  completedAt?: string;
}

export interface StepTimelineProps {
  steps: Step[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function StepTimeline({
  steps,
  orientation = 'vertical',
  className,
}: StepTimelineProps) {
  if (orientation === 'horizontal') {
    return (
      <div className={cn('flex items-start gap-4', className)}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                {/* Step circle */}
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 border-2 rounded-full mb-2',
                    step.status === 'completed' &&
                      'bg-green-500 border-green-600',
                    step.status === 'current' &&
                      'bg-primary-500 border-primary-600',
                    step.status === 'upcoming' && 'bg-gray-200 border-gray-300'
                  )}
                >
                  {step.status === 'completed' ? (
                    <Check size={20} className="text-white" />
                  ) : step.status === 'current' ? (
                    <Circle size={12} className="text-white fill-current" />
                  ) : (
                    <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  )}
                </div>

                {/* Step content */}
                <div className="text-center">
                  <p
                    className={cn(
                      'text-sm font-medium mb-1',
                      step.status === 'upcoming'
                        ? 'text-gray-500'
                        : 'text-gray-900'
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-600">{step.description}</p>
                  )}
                  {step.completedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {step.completedAt}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex items-center pt-5 px-4">
                  <div
                    className={cn(
                      'h-0.5 w-full',
                      step.status === 'completed'
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // Vertical orientation
  return (
    <Timeline className={className}>
      {steps.map((step) => (
        <TimelineItem
          key={step.id}
          title={step.title}
          description={step.description}
          time={step.completedAt}
          status={
            step.status === 'completed'
              ? 'success'
              : step.status === 'current'
              ? 'active'
              : 'default'
          }
          icon={
            step.status === 'completed' ? (
              <Check size={16} />
            ) : step.status === 'current' ? (
              <Circle size={12} className="fill-current" />
            ) : null
          }
        />
      ))}
    </Timeline>
  );
}

/**
 * CompactTimeline - Timeline compacta para espaços reduzidos
 */
export interface CompactTimelineItem {
  id: string;
  title: string;
  time: string;
  status?: 'default' | 'success' | 'warning' | 'error';
}

export interface CompactTimelineProps {
  items: CompactTimelineItem[];
  className?: string;
}

export function CompactTimeline({ items, className }: CompactTimelineProps) {
  const statusColors = {
    default: 'bg-gray-400',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="relative flex gap-3">
            {/* Dot */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  statusColors[item.status || 'default']
                )}
              />
              {!isLast && <div className="w-px h-full bg-gray-300 mt-1" />}
            </div>

            {/* Content */}
            <div className="flex-1 flex items-baseline justify-between gap-2 pb-3">
              <span className="text-sm text-gray-900">{item.title}</span>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {item.time}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * DateTimeline - Timeline agrupada por data
 */
export interface DateTimelineItem {
  id: string;
  date: string;
  events: Array<{
    id: string;
    title: string;
    time: string;
    description?: string;
    icon?: React.ReactNode;
    status?: 'default' | 'success' | 'warning' | 'error';
  }>;
}

export interface DateTimelineProps {
  items: DateTimelineItem[];
  className?: string;
}

export function DateTimeline({ items, className }: DateTimelineProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {items.map((dateGroup, dateIndex) => (
        <div key={dateGroup.id}>
          {/* Date header */}
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              {dateGroup.date}
            </h3>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Events for this date */}
          <Timeline>
            {dateGroup.events.map((event, eventIndex) => (
              <TimelineItem
                key={event.id}
                title={event.title}
                description={event.description}
                time={event.time}
                icon={event.icon}
                status={event.status}
                isLast={
                  dateIndex === items.length - 1 &&
                  eventIndex === dateGroup.events.length - 1
                }
              />
            ))}
          </Timeline>
        </div>
      ))}
    </div>
  );
}
