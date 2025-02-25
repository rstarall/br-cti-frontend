import { useTranslation } from 'react-i18next'

export const CtiMarket = () => {
  const { t } = useTranslation('ctiMarket')
  return (
    <div>
      <h1>{t('ctiMarket')}</h1>
    </div>
  )
}

export default CtiMarket
