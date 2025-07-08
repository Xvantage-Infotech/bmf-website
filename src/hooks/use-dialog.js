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
    }, 5000); // Auto close after 5s (was 3s in comment)
  };

  return (
    <DialogContext.Provider value={{ show }}>
      {children}
      <Dialog open={state.open}>
        {/* UPDATE WIDTH BELOW */}
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

export const useDialog = () => useContext(DialogContext);
