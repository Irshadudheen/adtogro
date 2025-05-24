import React from 'react';
import NProgress from 'nprogress';
// Custom NProgress style using Tailwind-like values
NProgress.configure({ showSpinner: false });

// Inject styles programmatically (Tailwind look-alike)
const style = document.createElement('style');
style.innerHTML = `
  #nprogress {
    pointer-events: none;
  }
  #nprogress .bar {
    background: #facc15; /* Tailwind 'cyan-400' */
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
  }
  #nprogress .peg {
    display: none;
  }
`;
if (!document.head.querySelector('style[data-nprogress-inline]')) {
  style.setAttribute('data-nprogress-inline', 'true');
  document.head.appendChild(style);
}

const lazyWithLoader = (importFunc) => {
  return React.lazy(() => {
    NProgress.start();
    return importFunc()
      .then((module) => {
        NProgress.done();
        return module;
      })
      .catch((err) => {
        NProgress.done();
        throw err;
      });
  });
};

export default lazyWithLoader;