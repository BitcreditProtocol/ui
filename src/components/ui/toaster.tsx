import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";

import { AppIcon } from "@/components/ui/app-icon";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  const icons = {
    success: <AppIcon icon={CircleCheckIcon} className="text-signal-success" size="md" />,
    info: <AppIcon icon={InfoIcon} className="text-text-300" size="md" />,
    warning: <AppIcon icon={TriangleAlertIcon} className="text-signal-alert" size="md" />,
    error: <AppIcon icon={OctagonXIcon} className="text-signal-error" size="md" />,
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...toastProps }) {
        const icon = icons[variant || "info"];
        return (
          <Toast key={id} variant={variant} {...toastProps}>
            <div className="flex gap-2">
              {icon}
              <div className="flex flex-col gap-1.5">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport position={toasts[0]?.position} />
    </ToastProvider>
  );
}
