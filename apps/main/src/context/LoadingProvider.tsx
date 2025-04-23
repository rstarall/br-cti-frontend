'use client'
import React, { createContext, useContext } from 'react';
import { Spin } from 'antd';

interface LoadingContextType {
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  showLoading: () => {},
  hideLoading: () => {}
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spinning, setSpinning] = React.useState(false);

  const showLoading = () => {
    setSpinning(true);
  };

  const hideLoading = () => {
    setSpinning(false);
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      <Spin spinning={spinning} fullscreen />
    </LoadingContext.Provider>
  );
};

