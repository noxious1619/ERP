import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Safety guard clause if used outside the context tree layout
  if (context === undefined) {
    throw new Error("useAuth must be utilized strictly inside an AuthProvider wrapper.");
  }
  
  return context;
};

export default useAuth;