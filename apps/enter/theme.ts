import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#0284c7', // primary-600 color
    borderRadius: 4,
  },
  components: {
    Button: {
      colorPrimary: '#0284c7',
      algorithm: true,
    },
    Tabs: {
      colorPrimary: '#0284c7',
      itemSelectedColor: '#0284c7',
      inkBarColor: '#0284c7',
    },
  },
};

export default theme;
