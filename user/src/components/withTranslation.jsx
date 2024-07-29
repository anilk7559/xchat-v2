// components/withTranslation.js
import React from 'react';
import { useTranslation } from 'next-i18next';

const withTranslation = (WrappedComponent) => (props) => {
  const { t } = useTranslation('common');
  return <WrappedComponent t={t} {...props} />;
};

export default withTranslation;
