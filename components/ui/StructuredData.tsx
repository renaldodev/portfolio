type StructuredDataProps = {
  name: string;
  description: string;
  jobTitle: string;
  url: string;
  locale: string;
};

export default function StructuredData({
  name,
  description,
  jobTitle,
  url,
  locale,
}: StructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    url,
    sameAs: ['https://github.com/renaldodev', 'https://linkedin.com/in/renaldodev'],
    knowsAbout: [
      'Backend Development',
      'Artificial Intelligence',
      'Software Engineering',
      'Next.js',
      'TypeScript',
      'Python',
      'React',
      'Node.js',
    ],
    description,
    inLanguage: locale,
    image: `${url}/og-image.png`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
