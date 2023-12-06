import { FC } from 'react';

// =================================================
type TestimonialCard1Props = {
  name: string;
  review: string;
  shadow?: boolean;
  designation: string;
  hideRating?: boolean;
};
// =================================================

const TestimonialCard1: FC<TestimonialCard1Props> = (props) => {
  const { name, review, designation, hideRating, shadow } = props;

  return (
    <div className={`card ${shadow ? 'shadow-lg' : ''}`}>
      <div className="card-body">
        {!hideRating && <span className="ratings five mb-3" />}

        <blockquote className="icon mb-0">
          <p>“{review}”</p>

          <div className="blockquote-details">
            <div className="info">
              <h5 className="mb-0">{name}</h5>
              <p className="mb-0">{designation}</p>
            </div>
          </div>
        </blockquote>
      </div>
    </div>
  );
};

export default TestimonialCard1;
