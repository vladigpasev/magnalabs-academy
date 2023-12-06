import bg from '../../translations/bg.json';
const flatten = require('flat')

const translations: object = {
  bg,
}

class Translator {
  _locale: string = 'en';
  t (key: string, parameters: {
    [key: string]: any,
  } = {}) {
    const localeAndKey = this._locale + '.' + key
    const flattedTranslations: {
      [key: string]: string,
    } = flatten.flatten(translations)
    const message: string = Object.keys(flattedTranslations).includes(localeAndKey) ? flattedTranslations[localeAndKey] : localeAndKey
    if (Object.keys(parameters).length > 0) {
      let parsedMessage: string = message
      for (const parameterKey in parameters) {
        parsedMessage = parsedMessage.replace('{{ ' + parameterKey + ' }}', parameters[parameterKey])
      }
      return parsedMessage
    }
    return message
  }

  get locale () {
    return this._locale
  }

  set locale (newLocale) {
    this._locale = newLocale
  }
}

export default Translator;
