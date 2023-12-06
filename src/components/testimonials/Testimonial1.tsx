import { FC } from 'react';
// -------- custom hook -------- //
import useIsotope from 'hooks/useIsotope';
import TestimonialCard1 from "../testimonial-cards/TestimonialCard1";

interface Testimonial {
  id: number,
  name: string,
  designation: string;
  review: string;
}

type TestimonialCard1Props = {
  title: string;
  subtitle?: string;
  description?: string;
  testimonials?: Testimonial[];
  titleClassNames?: string;
  subtitleClassNames?: string;
  descriptionClassNames?: string;
};

const Testimonial1: FC<TestimonialCard1Props> = ({ title, subtitle = null, description = null, testimonials = [], titleClassNames = '', subtitleClassNames = '', descriptionClassNames = '' }) => {
  // used for masonry grid layout
  useIsotope();

  return (
    <section className="wrapper">
      <div className="container">
        <div className="row text-center">
          <div className="col-lg-8 offset-lg-2 mb-10">
            <h2 className={`fs-16 text-uppercase mb-3 ${subtitleClassNames}`}>{ subtitle }</h2>
            <h3 className={`display-3 px-xxl-10 ${description ? 'mb-3' : ''} ${titleClassNames}`}>{ title }</h3>
            { description ? (
              <p className={`lead ${descriptionClassNames}`}>{ description }</p>
            ) : null }
          </div>
        </div>

        <div className="grid">
          <div className="row isotope gy-6">
            {testimonials.map((item) => (
              <div className="item col-12 col-lg-4" key={item.id}>
                <TestimonialCard1 {...item} shadow />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial1;
