import { FC } from 'react';
import Accordion, {AccordionProps} from "./Accordion";

interface AccordionListProps {
  accordions: AccordionProps[]
}

const AccordionList: FC<AccordionListProps> = ({ accordions }) => {
  return (
    <div className="accordion accordion-wrapper" id="accordionExample">
      {accordions.map((item) => (
        <Accordion type="plain" key={item.id} {...item} />
      ))}
    </div>
  );
};

export default AccordionList;
