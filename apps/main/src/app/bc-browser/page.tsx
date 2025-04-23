import { useTranslation } from 'react-i18next'

export const BcBrowser = () => {
  const { t } = useTranslation('bcBrowser')
  return <div>{t('bcBrowser')}</div>
}

