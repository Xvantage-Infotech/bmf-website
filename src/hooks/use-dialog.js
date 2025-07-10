"use client";

import { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [state, setState] = useState({
    open: false,
    title: "",
    description: "",
  });

  const show = ({ title, description }) => {
    setState({ open: true, title, description });

    setTimeout(() => {
      setState((prev) => ({ ...prev, open: false }));
    }, 3000); // Auto close after 5s
  };

  return (
    <DialogContext.Provider value={{ show }}>
      {children}
      <Dialog open={state.open}>
        <DialogContent className="max-w-xl w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>{state.title}</DialogTitle>
            <DialogDescription>{state.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);

  if (!context) {
    if (process.env.NODE_ENV === "development") {
      throw new Error("useDialog must be used within a DialogProvider");
    }
    return { show: () => {} };
  }

  return context;
};
