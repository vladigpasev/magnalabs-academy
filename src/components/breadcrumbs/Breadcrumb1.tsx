import { FC } from 'react';
import NextLink from "../links/NextLink";

// ========================================================
type Breadcrumb1Props = {
  className?: string;
  data?: { id: number; title: string; url: string }[];
};
// ========================================================

const Breadcrumb1: FC<Breadcrumb1Props> = ({ data = [], className = '' }) => {
  return (
    <nav className="d-inline-block" aria-label="breadcrumb">
      <ol className={`breadcrumb ${className}`}>
        {data.map(({ id, title, url }, i) => {
          return data.length - 1 === i ? (
            <li key={id} className="breadcrumb-item active" aria-current="page">
              {title}
            </li>
          ) : (
            <li className="breadcrumb-item" key={id}>
              <NextLink title={title} href={url} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb1;
