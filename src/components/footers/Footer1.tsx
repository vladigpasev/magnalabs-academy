import {FC, useContext} from 'react';
import SocialLinks from 'components/social-links/SocialLinks1';
import TranslatorContext from "../../modules/translator/TranslatorContext";
import NextLink from "../links/NextLink";

const Footer1: FC = () => {
  const translator = useContext(TranslatorContext);

  return (
    <footer>
      <div className="container pt-13 pb-7">
        <div className="row gx-lg-0 gy-6">
          <div className="col-lg-4">
            <div className="widget">
              <img className="logo mb-4" src="/img/logo.gif" alt="logo" />
              <p className="lead mb-0">
                {translator.t('brandSlogan')}
              </p>
            </div>
          </div>

          <div className="col-lg-3 offset-lg-2">
            <div className="widget">
              <div className="d-flex flex-row">
                <div>
                  <div className="icon text-primary fs-28 me-4 mt-n1">
                    <i className="uil uil-phone-volume" />
                  </div>
                </div>

                <div>
                  <h5 className="mb-1">
                    { translator.t('content./.footer1.content.phone') }
                  </h5>
                  <p className="mb-0">
                    <NextLink className="link-body" title={translator.t('brandPhone')} href={`tel:${translator.t('brandPhone')}`} />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="widget">
              <div className="d-flex flex-row">
                <div>
                  <div className="icon text-primary fs-28 me-4 mt-n1">
                    <i className="uil uil-envelope" />
                  </div>
                </div>

                <div className="align-self-start justify-content-start">
                  <h5 className="mb-1">
                    { translator.t('content./.footer1.content.email') }
                  </h5>
                  <p className="mb-0">
                    <NextLink className="link-body" title={translator.t('brandEmail')} href={`mailto:${translator.t('brandEmail')}`} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-11 mt-md-12 mb-7" />
        <div className="d-md-flex align-items-center justify-content-between">
          <p className="mb-2 mb-lg-0">© {new Date().getFullYear()} {translator.t('companyName')}. {translator.t('content./.footer1.title')}</p>
          <SocialLinks className="nav social social-muted mb-0 text-md-end" />
        </div>
      </div>
    </footer>
  );
};

export default Footer1;
