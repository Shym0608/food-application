import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        classNames: {
          // Changed bg to orange and text to white
          toast:
            "bg-orange-500 text-white border-none shadow-lg rounded-md font-medium",
          description: "text-orange-50",
          actionButton: "bg-white text-orange-600",
          cancelButton: "bg-orange-600 text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
