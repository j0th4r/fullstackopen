import Part from './Part';
import type { ContentProps } from '../types';

const Content = (props: ContentProps) => {
  const { courseParts } = props;
  return (
    <div>
      {courseParts.map((part, index) => (
        <Part key={index} part={part} />
      ))}
    </div>
  );
};

export default Content;
