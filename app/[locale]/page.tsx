import PageShell from '@/components/layout/PageShell';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('common');

  return <PageShell tAllRightsReserved={t('allRightsReserved')} tBuiltWith={t('builtWith')} />;
}
