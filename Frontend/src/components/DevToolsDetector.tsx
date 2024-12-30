import React, { useEffect } from 'react';

const DevToolsDetector: React.FC = () => {
  useEffect(() => {
    let lastState = false;

    const detectDevTools = () => {
      const threshold = 160;
      const widthThresholdExceeded = window.outerWidth - window.innerWidth > threshold;
      const heightThresholdExceeded = window.outerHeight - window.innerHeight > threshold;

      const devtoolsOpen = widthThresholdExceeded || heightThresholdExceeded;

      if (devtoolsOpen !== lastState) {
        lastState = devtoolsOpen;
        if (devtoolsOpen) {
          console.log('%cVui lòng tắt DevTools để tiếp tục!', 'color: red; font-size: 16px;');
          console.log('%cPlease disable DevTools to continue using!', 'color: red; font-size: 16px;');
        }
      }
    };

    const interval = setInterval(detectDevTools, 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default DevToolsDetector;
