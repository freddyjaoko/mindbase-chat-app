import { Button, ButtonProps } from "./ui/button";

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function PrimaryButton({ children, className, ...props }: PrimaryButtonProps) {
  return (
    <Button
      {...props}
      className={`ml-3 ${className || ""}`}
    >
      {children}
    </Button>
  );
}
