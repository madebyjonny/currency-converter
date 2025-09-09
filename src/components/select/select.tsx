import { Label } from "../label/label";

interface SelectProps extends React.ComponentProps<"select"> {
  label: string;
  id: string;
  children: React.ReactNode;
}

export function Select({
  children,
  className,
  id,
  name,
  label,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col flex-1 gap-1">
      <Label htmlFor={id}>{label}</Label>

      <select
        className={`p-2 border rounded flex-1 ${className ?? ""}`}
        id={id}
        name={name}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
