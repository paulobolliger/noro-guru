import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Site',
    description: 'Site gerado por blueprint',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    );
}
