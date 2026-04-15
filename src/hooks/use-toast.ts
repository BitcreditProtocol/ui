import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  position?: string;
};

const actionType = {
  addToast: "ADD_TOAST",
  updateToast: "UPDATE_TOAST",
  dismissToast: "DISMISS_TOAST",
  removeToast: "REMOVE_TOAST",
} as const;

type Action =
  | {
      type: (typeof actionType)["addToast"];
      toast: ToasterToast;
    }
  | {
      type: (typeof actionType)["updateToast"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: (typeof actionType)["dismissToast"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: (typeof actionType)["removeToast"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionType.removeToast,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionType.addToast:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionType.updateToast:
      return {
        ...state,
        toasts: state.toasts.map((toast) => (toast.id === action.toast.id ? { ...toast, ...action.toast } : toast)),
      };

    case actionType.dismissToast: {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === toastId || toastId === undefined
            ? {
                ...toast,
                open: false,
              }
            : toast
        ),
      };
    }

    case actionType.removeToast:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      };
  }
};

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (nextToast: ToasterToast) => {
    dispatch({
      type: actionType.updateToast,
      toast: { ...nextToast, id },
    });
  };

  const dismiss = () => {
    dispatch({ type: actionType.dismissToast, toastId: id });
  };

  dispatch({
    type: actionType.addToast,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (isOpen) => {
        if (!isOpen) {
          dismiss();
        }
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);

    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      dispatch({ type: actionType.dismissToast, toastId });
    },
  };
}

export { toast, useToast };
