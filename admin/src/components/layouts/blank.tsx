import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
}

export function BlankLayout({
  children
}: Props) {
  return <div>{children}</div>;
}

export default BlankLayout;
