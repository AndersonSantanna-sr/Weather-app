import type { FC, ReactNode } from 'react';

export type Props = {
  condition: boolean;
  children: ReactNode | string;
};

const If: FC<Props> = ({ condition, children }): ReactNode | null => (condition ? children : null);

export default If;
