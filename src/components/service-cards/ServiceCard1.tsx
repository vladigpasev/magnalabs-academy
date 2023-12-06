import { FC } from 'react';
import IconProps from 'types/icon';
import NextLink from '../links/NextLink';

// ===============================================================
type ServiceCard1Props = {
  title: string;
  linkUrl?: string;
  description: string;
  cardClassName?: string;
  iconClassName?: string;
  Icon: (props: IconProps) => JSX.Element;
};
// ===============================================================

const ServiceCard1: FC<ServiceCard1Props> = (props) => {
  const { title, description, Icon, linkUrl = null, cardClassName = '', iconClassName } = props;

  return (
    <div className={`card shadow-lg h-100 ${cardClassName}`}>
      <div className={`card-body position-relative ${ linkUrl ? 'mb-5' : '' }`}>
        <Icon className={iconClassName} />
        <h4>{title}</h4>
        <p className="mb-2">{description}</p>
        { linkUrl ? (<NextLink title="Learn More" href={linkUrl} className={`more hover position-absolute bottom-0`} />) : null }
      </div>
    </div>
  );
};

export default ServiceCard1;
