import Translator from '../translator/Translator';
import {NextRouter} from 'next/router';

class Seo {
  readonly #_translator: Translator;
  readonly #_path: string;
  readonly #_origin: string;
  readonly #_locale: string;
  readonly #_locales: string[];
  readonly #_defaultLocale: string;

  constructor(translator: Translator, router: NextRouter) {
    const { asPath, locale, defaultLocale, locales } = router;
    this.#_translator = translator;
    const url = new URL(asPath, 'https://www.google.com');
    this.#_path = router.route === '/404' ? '/404' : url.pathname;
    this.#_origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : '';
    this.#_locale = typeof locale === 'undefined' ? 'en' : locale;
    this.#_locales = typeof locales === 'undefined' ? [] : locales;
    this.#_defaultLocale = typeof defaultLocale === 'undefined' ? 'en' : defaultLocale;
  }

  get applicationNameMetaTag () {
    return <meta name="application-name" content={`${this.#_translator.t(`brandTitle`)} Website`}/>;
  }

  get authorMetaTag () {
    return <meta name="author" content={`${this.#_translator.t(`brandTitle`)} Software Team`}/>;
  }

  get titleTag () {
    return <title>{ this.#_translator.t(`seo.${this.#_path}.title`) }</title>;
  }

  get descriptionMetaTag () {
    if (this.#_path === '/404') {
      return null;
    }
    return <meta name="description" content={this.#_translator.t(`seo.${this.#_path}.description`)}/>;
  }

  get keywordsMetaTag () {
    if (this.#_path === '/404') {
      return null;
    }
    return <meta name="keywords" content={this.#_translator.t(`seo.${this.#_path}.keywords`)}/>;
  }

  get hreflangTags (): JSX.Element[] {
    if (this.#_path === '/404') {
      return [];
    }
    const tags: {
      hreflang: string,
      href: string,
    }[] = [];
    tags.push({
      hreflang: 'x-default',
      href: `${this.#_origin}${this.#_path}`
    });
    this.#_locales.forEach(locale => tags.push({
      hreflang: locale,
      href: `${this.#_origin}/${locale}${this.#_path}`
    }));
    return [];
    return tags.map(tag => (<link key={tag.hreflang} rel="alternate" hrefLang={tag.hreflang} href={tag.href}/>));
  }
}

export default Seo;
