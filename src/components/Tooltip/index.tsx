import React from 'react';

import { Container } from './styles';

interface TootltipProps {
  title: string;
  className?: string;
}

const Tooltip: React.FC<TootltipProps> = ({ title, className, children }) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default Tooltip;
