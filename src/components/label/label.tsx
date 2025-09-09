interface LabelProps extends React.ComponentProps<"label"> {
  children: React.ReactNode;
  htmlFor: string;
}

export function Label({ children, className, htmlFor, ...props }: LabelProps) {
  return (
    <label
      className={`font-bold ${className ?? ""}`}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </label>
  );
}
