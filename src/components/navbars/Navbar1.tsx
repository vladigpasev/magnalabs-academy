import {FC, Fragment, useContext, useRef} from 'react';
import NextLink from 'components/links/NextLink';
import SocialLinks from 'components/social-links/SocialLinks1';
import ListItemLink from 'components/links/ListItemLink';
import TranslatorContext from "../../modules/translator/TranslatorContext";
import DropdownToggleLink from 'components/links/DropdownToggleLink';
import {useRouter} from 'next/router';

// ===================================================================
type Navbar1Props = {
  navClassName?: string;
};
// ===================================================================

const mapLocaleToFlagId = (locale: string): string => {
  const map: {
    [key: string]: string,
  } = {
    en: 'us'
  };
  if (Object.keys(map).includes(locale)) {
    return map[locale];
  }
  else {
    return locale;
  }
};

const Navbar1: FC<Navbar1Props> = ({ navClassName }) => {
  const translator = useContext(TranslatorContext);
  const navbarRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const { locale, locales, pathname, asPath, query } = router;

  if (typeof locales === 'undefined') {
    return null;
  }

  const logos = (
    <img className={"logo"} src="/img/logo.gif" alt="logo" />
  );

  return (
    <Fragment>
      <nav ref={navbarRef} className={navClassName}>
        <div className="container justify-content-between align-items-center navbar-bubble shadow shadow-xlg">
          <div className="d-flex flex-row w-100 justify-content-between align-items-center d-lg-none">
            <div className="navbar-brand p-0">
              <NextLink href="/" title={logos} />
            </div>

            <div className="navbar-other ms-auto">
              <ul className="navbar-nav flex-row align-items-center">
                <li className="nav-item d-lg-none">
                  <button
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvas-nav"
                    className="hamburger offcanvas-nav-btn"
                  >
                    <span />
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="navbar-collapse-wrapper d-flex flex-row align-items-center w-100">
            <div
              id="offcanvas-nav"
              data-bs-scroll="true"
              className="navbar-collapse offcanvas offcanvas-nav offcanvas-start"
            >
              <div className="offcanvas-header order-0 order-lg-1 d-lg-flex p-lg-0">
                <NextLink href="/" className="transition-none d-none d-lg-flex" title={logos} />
                <button
                  type="button"
                  aria-label="Close"
                  data-bs-dismiss="offcanvas"
                  className="btn-close btn-close-white d-lg-none"
                />
              </div>

              <div className="order-3 order-lg-2 d-lg-flex offcanvas-body">
                <ul className="navbar-nav me-lg-auto">
                  <ListItemLink href='/#services' title={translator.t('content./.navbar1.services')}/>
                  <ListItemLink href='/#process' title={translator.t('content./.navbar1.process')}/>
                  <ListItemLink href='/#testimonials' title={translator.t('content./.navbar1.testimonials')}/>
                  <ListItemLink href='/#faq' title={translator.t('content./.navbar1.faq')}/>
                  <ListItemLink href='/contact' title={translator.t('content./.navbar1.contact')}/>
                  <li className="nav-item dropdown locale-dropdown">
                    <DropdownToggleLink title={translator.t(`locales.${locale}`)} className="nav-link dropdown-toggle" />

                    <div className="dropdown-menu">
                      <ul className="list-unstyled">
                        {
                          locales.filter(lang => lang !== locale).map(lang => (
                            <li key={lang} className="nav-item">
                              <button
                                key={lang}
                                className="dropdown-item"
                                onClick={() => {
                                  router.push({ pathname, query }, asPath, { locale: lang })
                                }}
                              >
                                <img
                                  className="locale-flag"
                                  src={`https://flagcdn.com/${mapLocaleToFlagId(lang)}.svg`}
                                  alt={`${lang} flag`}
                                />
                                { translator.t(`locales.${lang}`) }
                              </button>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>

              {/* ============= show contact info in the small device sidebar ============= */}
              <div className="offcanvas-body d-lg-none order-4 mt-auto">
                <div className="offcanvas-footer">
                  <div>
                    <NextLink title={translator.t('brandPhone')} href={`tel:${translator.t('brandPhone')}`} />
                    <br />
                    <NextLink title={translator.t('brandEmail')} href={`mailto:${translator.t('brandEmail')}`} />
                    <br />
                    <SocialLinks />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

// set deafult Props
Navbar1.defaultProps = {
  navClassName: 'navbar navbar-expand-lg position-fixed navbar-light px-2 py-3'
};

export default Navbar1;
