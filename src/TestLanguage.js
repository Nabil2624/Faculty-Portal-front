import React from 'react'
import { useTranslation } from 'react-i18next'


const TestLanguage = () => {
    const { t, i18n } = useTranslation("translation"); // load dashboard.json

  return (
    <>
        
      <div>
      <h1>{t("title")}</h1>
      <button onClick={() => i18n.changeLanguage("en")}>
        Switch to English
      </button>
      <button onClick={() => i18n.changeLanguage("ar")}>
        الرجوع للعربية
      </button>
    </div>
   



    </>
  )
}

export default TestLanguage