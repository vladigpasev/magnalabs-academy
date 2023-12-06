import { FC, ReactElement } from 'react';
import ListColumn from 'components/reuseable/ListColumn';

// ============================================================
type Services1Props = {
  title: string;
  description: string;
  colOne: ReactElement;
  subtitle?: string;
  bulletColor?: string;
  rowClassNames?: string;
  colOneClassNames?: string;
  colTwoClassNames?: string;
  titleClassNames?: string;
  bullets?: string[][];
  content?: ReactElement;
};
// ============================================================

const Services1: FC<Services1Props> = (props) => {
  const { colOne, title, description, subtitle = null, colOneClassNames = '', colTwoClassNames = '', titleClassNames = '', rowClassNames = '', bulletColor = 'primary', bullets = [], content = null } = props;

  return (
    <div className={'row gy-10 gy-lg-0 align-items-center ' + rowClassNames}>
      <div className={`col-lg-6 ${colOneClassNames}`}>
        {colOne}
      </div>

      <div className={`col-lg-6 ${colTwoClassNames}`}>
        { subtitle ? (<span className="fw-bold text-gradient gradient-1 mb-2">{ subtitle }</span>) : null }
        <h3 className={`display-4 mb-5 ${titleClassNames}`}>{title}</h3>
        <p className={`${bullets.length || content ? 'mb-5' : ''}`}>{description}</p>

        { bullets.length ? <ListColumn list={bullets} bulletColor={bulletColor} /> : null }
        { content ? content : null }
      </div>
    </div>
  );
};

export default Services1;
