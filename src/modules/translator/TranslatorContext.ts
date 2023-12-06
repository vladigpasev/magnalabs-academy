import React from 'react'
import Translator from './Translator'

const translator = new Translator();

const TranslatorContext = React.createContext<Translator>(translator);
export default TranslatorContext
