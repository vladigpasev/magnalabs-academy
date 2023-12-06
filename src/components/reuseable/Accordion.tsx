import { FC } from 'react';

export interface AccordionProps {
  id: number;
  body: string;
  heading: string;
  expand: boolean;
  type?: 'plain' | 'shadow-lg';
}

const Accordion: FC<AccordionProps> = (props) => {
  const { id, body, heading, expand, type = '' } = props;

  return (
    <div className={`card ${type} accordion-item`}>
      <div className="card-header" id={`heading${id}`}>
        <button
          data-bs-toggle="collapse"
          aria-controls={`collapse${id}`}
          data-bs-target={`#collapse${id}`}
          aria-expanded={expand ? 'true' : 'false'}
          className={expand ? 'accordion-button' : 'collapsed'}
        >
          {heading}
        </button>
      </div>

      <div
        id={`collapse${id}`}
        aria-labelledby={`heading${id}`}
        data-bs-parent="#accordionExample"
        className={`accordion-collapse collapse ${expand && 'show'}`}
      >
        <div className="card-body">
          <p>{body}</p>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
