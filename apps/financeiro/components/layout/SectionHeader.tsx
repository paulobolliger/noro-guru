import { ReactNode } from 'react'

interface SectionHeaderProps {
    title: string
    subtitle?: string
    icon?: ReactNode
    action?: ReactNode
}

export default function SectionHeader({ title, subtitle, icon, action }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between pb-6 border-b">
            <div className="flex items-center gap-4">
                {icon && (
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {icon}
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#1a1f36]">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                    )}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}
