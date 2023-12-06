import Head from 'next/head';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { Fragment, useEffect, useState } from 'react';
import ThemeProvider from '../src/modules/theme/ThemeProvider';
import Translator from '../src/modules/translator/Translator';
import TranslatorContext from 'modules/translator/TranslatorContext';

// Bootstrap and custom scss
import 'assets/scss/style.scss';
import 'assets/global.css';
// animate css
import 'animate.css';
// import swiper css
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
// video player css
import 'plyr-react/plyr.css';
// glightbox css
import 'glightbox/dist/css/glightbox.css';
// custom scrollcue css
import 'plugins/scrollcue/scrollCue.css';
import Seo from '../src/modules/seo/Seo';
import UserContext, {isUserValid, User} from "../src/modules/user/UserContext";
import PageProgress from "../src/components/common/PageProgress";
import useProgressbar from "../src/hooks/useProgressbar";
import SurveyDataContext, {SurveyData} from "../src/modules/surveyData/SurveyDataContext";
import {doc, getDoc} from "firebase/firestore";
import Firestore from "../src/modules/firebase/Firestore";

// =========================================================================
if (typeof window !== 'undefined') {
  // load bootstrap functionality
  (() => {
    const bootstrap = require('bootstrap');

    // Enables multilevel dropdown
    (function (bs) {
      const CLASS_NAME = 'has-child-dropdown-show';

      bs.Dropdown.prototype.toggle = (function (_original) {
        return function () {
          document.querySelectorAll('.' + CLASS_NAME).forEach(function (e) {
            e.classList.remove(CLASS_NAME);
          });
          // @ts-ignore
          let dd = this._element.closest('.dropdown').parentNode.closest('.dropdown');
          for (; dd && dd !== document; dd = dd.parentNode.closest('.dropdown')) {
            dd.classList.add(CLASS_NAME);
          }
          // @ts-ignore
          return _original.call(this);
        };
      })(bs.Dropdown.prototype.toggle);

      document.querySelectorAll('.dropdown').forEach(function (dd) {
        dd.addEventListener('hide.bs.dropdown', function (e) {
          // @ts-ignore
          if (this.classList.contains(CLASS_NAME)) {
            // @ts-ignore
            this.classList.remove(CLASS_NAME);
            e.preventDefault();
          }
          e.stopPropagation();
        });
      });
    })(bootstrap);
  })();
}
// =========================================================================

const defaultTranslator = new Translator();
const USER_STORAGE_KEY = 'USER';

function MyApp({ Component, pageProps }: AppProps) {
  useProgressbar();
  const router = useRouter();
  const { pathname, locale } = router;
  const [translator, setTranslator] = useState<Translator>(defaultTranslator);
  const [user, setUser] = useState<User|null>(null);
  const [surveyData, setSurveyData] = useState<SurveyData|null>(null);

  const logOut = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  useEffect(() => {
    const userAsJsonFromStorage = localStorage.getItem(USER_STORAGE_KEY);
    if (userAsJsonFromStorage !== null) {
      const user = JSON.parse(userAsJsonFromStorage);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (['/terms-and-conditions'].includes(pathname)) {
      return;
    }
    if (['/admin'].includes(pathname)) {
      return;
    }
    if (['/admin/login'].includes(pathname)) {
      return;
    }
    if (['/admin/surveys'].includes(pathname)) {
      return;
    }
    if (['/admin/surveys/new'].includes(pathname)) {
      return;
    }
    if (user === null) {
      if (!['/login', '/reset-password'].includes(pathname)) {
        router.push({
          pathname: '/login',
        });
      }
    }
    else {
      if (isUserValid(user)) {
        router.push({
          pathname: '/',
        });
      }
      else {
        router.push({
          pathname: '/register',
        });
      }
      if (['/login', '/reset-password'].includes(pathname)) {
        router.push({
          pathname: '/',
        });
      }
    }
  }, [user, pathname]);

  useEffect(() => {
    const newTranslator = new Translator();
    newTranslator.locale = String(locale);
    setTranslator(newTranslator);
  }, [locale]);

  useEffect(() => {
    const docRef = doc(Firestore, "surveyData", "active");
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const newSurveyData = docSnap.data();
        setSurveyData({
          activeSurveyId: newSurveyData.activeSurveyId,
          surveys: newSurveyData.surveys,
        });
      }
    });
  }, []);

  // scroll animation added
  useEffect(() => {
    (async () => {
      const scrollCue = (await import('plugins/scrollcue')).default;
      scrollCue.init({ interval: -400, duration: 700, percentage: 0.8 });
      scrollCue.update();
    })();
  }, [pathname]);

  const seo = new Seo(translator, router);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      logOut,
    }}>
      <TranslatorContext.Provider value={translator}>
        <SurveyDataContext.Provider value={{
          surveyData,
          setSurveyData,
        }}>
          <Fragment>
            <Head>
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />

              { seo.titleTag }
              { seo.descriptionMetaTag }
              { seo.keywordsMetaTag }
              { seo.applicationNameMetaTag }
              { seo.authorMetaTag }
              { seo.hreflangTags }
            </Head>

            <ThemeProvider>
              <div className="page-loader" />

              <PageProgress />

              {/* ========== main content ========== */}
              <main className="content-wrapper">

                {/* ========== page title section ========== */}
                <section
                  className="wrapper image-wrapper bg-image bg-overlay bg-overlay-light-600 text-white"
                  style={{ backgroundImage: 'url(/img/photos/bg1.png)' }}
                >
                  <div className="container pt-10 pt-lg-12 pb-21 text-center">
                    <div className="row">
                      <div className="col-lg-8 mx-auto">
                        <div className="d-flex justify-content-center gap-5 mb-5 mb-lg-7">
                          {
                            pathname === '/login' ? (
                              <img className="card heading-logo" src="/img/photos/BAPF.png" alt="BAPF" />
                            ) : null
                          }
                          {
                            pathname === '/login' ? (
                              <img className="card heading-logo p-1" src="/img/photos/MAGNALABS.png" alt="MAGNALABS" />
                            ) : null
                          }
                        </div>
                        <h1 className="display-1">{ translator.t(`seo.${pathname}.title`) }</h1>
                        {
                          user !== null ? (
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill mt-3"
                              onClick={logOut}
                            >
                              { translator.t('words.logOut') }
                            </button>
                          ) : null
                        }
                      </div>
                    </div>
                  </div>
                </section>

                <section className="wrapper bg-light">
                  <div className="container pb-14 pb-md-16">
                    <Component {...pageProps} />
                  </div>
                </section>

              </main>

            </ThemeProvider>
          </Fragment>
        </SurveyDataContext.Provider>
      </TranslatorContext.Provider>
    </UserContext.Provider>
  );
}

export default MyApp;
