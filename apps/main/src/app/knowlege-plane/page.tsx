import { useTranslation } from 'react-i18next'

export const KnowledgePlane = () => {
  const { t } = useTranslation('knowledgePlane')
  return <div>{t('knowledgePlane')}</div>
}

