import { Label } from "../label/label";

interface InputProps extends React.ComponentProps<"input"> {
  label: string;
  id: string;
  name: string;
}

export function Input({ className, id, name, label, ...props }: InputProps) {
  return (
    <div className="flex flex-col flex-1 gap-1">
      <Label htmlFor={id}>{label}</Label>

      <input
        className={`p-2 border rounded flex-1 ${className ?? ""}`}
        id={id}
        name={name}
        {...props}
      />
    </div>
  );
}
