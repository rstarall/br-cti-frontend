import { useTranslation } from 'react-i18next'

export const Index = () => {
  const { t } = useTranslation('home')
  return (
    <div>
      <h1>{t('home')}</h1>
    </div>
  )
}

export default Index
