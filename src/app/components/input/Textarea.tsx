import { useInputContext } from "./Context";

type TextareaProps = React.ComponentPropsWithoutRef<"textarea">;

const Textarea = (props: TextareaProps) => {
  const { name } = useInputContext(Textarea.name);
  const _name = props.name ? `${name}.${props.name}` : name;

  return (
    <textarea
      {...props}
      className="m-0.5 p-1.5 rounded bg-transparent outline-none font-medium w-full transition"
      name={_name}
      id={_name}
    />
  );
};

export { Textarea };
