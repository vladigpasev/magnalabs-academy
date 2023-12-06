import { FC } from 'react';
import NextLink from "../links/NextLink";

interface Cta1Props {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const CTA1: FC<Cta1Props> = ({ title, description, buttonText, buttonLink }) => {
  return (
    <div
      className="image-wrapper bg-full bg-image bg-overlay bg-overlay-light-500"
      style={{ backgroundImage: 'url(/img/photos/bg2.png)' }}
    >
      <div className="card-body py-14 px-0">
        <div className="container">
          <div className="row text-center">
            <div className="col-xl-11 col-xxl-9 mx-auto">
              <h2 className="fs-16 text-uppercase text-gradient gradient-4 mb-3">{ title }</h2>
              <h3 className="display-4 text-gradient gradient-4 mb-7 px-lg-17">
                { description }
              </h3>
            </div>
          </div>

          <div className="d-flex justify-content-center">
              <span>
                <NextLink
                  title={buttonText}
                  href={buttonLink}
                  className="btn btn-lg btn-gradient gradient-4 rounded"/>
              </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA1;
