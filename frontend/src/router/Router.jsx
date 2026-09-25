import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const RouterContext = createContext(null);

export function navigate(to) {
  if (window.location.pathname !== to) {
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

export function useNavigate() {
  const context = useContext(RouterContext);
  return context ? context.navigate : navigate;
}

export function useLocation() {
  const context = useContext(RouterContext);
  return context ? context.currentPath : window.location.pathname;
}

export function Link({ to, children, className = '', onClick = null, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

export function RouterProvider({ routes }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route protection logic
  useEffect(() => {
    if (isLoading) return;

    if (currentPath === '/app' && !isAuthenticated) {
      navigate('/login');
    } else if ((currentPath === '/login' || currentPath === '/register') && isAuthenticated) {
      navigate('/app');
    }
  }, [currentPath, isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Determine active component
  let Component = routes['/']; // Default landing

  if (currentPath === '/login') {
    Component = routes['/login'] || routes['/'];
  } else if (currentPath === '/register') {
    Component = routes['/register'] || routes['/'];
  } else if (currentPath === '/app') {
    if (isAuthenticated) {
      Component = routes['/app'] || routes['/'];
    } else {
      Component = routes['/login'] || routes['/'];
    }
  }

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      <Component />
    </RouterContext.Provider>
  );
}
