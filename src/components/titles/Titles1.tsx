import { FC } from 'react';

// ============================================================
type Titles1Props = {
  title: string;
  description: string;
  subtitle?: string;
  rowClassNames?: string;
  titleClassNames?: string;
  subtitleClassNames?: string;
  descriptionClassNames?: string;
};
// ============================================================

const Titles1: FC<Titles1Props> = (props) => {
  const { title, description, subtitle = null, rowClassNames = '', titleClassNames = '', subtitleClassNames = '', descriptionClassNames = '' } = props;

  return (
    <div className={'row text-center ' + rowClassNames}>
      <div className={'col-12 col-lg-8 mx-auto'}>
        { subtitle ? (<span className={`fw-bold mb-2 ${subtitleClassNames}`}>{ subtitle }</span>) : null }
        <h3 className={`display-4 mb-5 ${titleClassNames}`}>{title}</h3>
        <p className={`mb-5 ${descriptionClassNames}`}>{description}</p>
      </div>
    </div>
  );
};

export default Titles1;
