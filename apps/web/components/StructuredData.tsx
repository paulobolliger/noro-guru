'use client';

import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data)
    ? data
    : [data];

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': jsonLd,
        }),
      }}
    />
  );
}
