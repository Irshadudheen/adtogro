import { createContext, useContext, useState } from "react";

const LoginModalContext = createContext();

export function LoginModalProvider({ children }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <LoginModalContext.Provider value={{ isLoginModalOpen, setIsLoginModalOpen }}>
      {children}
    </LoginModalContext.Provider>
  );
}


export function useLoginModal() {
  return useContext(LoginModalContext);
}
