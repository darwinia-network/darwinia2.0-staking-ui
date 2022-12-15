import { forwardRef, useImperativeHandle } from "react";

interface SelectCollatorRefs {
  toggle: () => void;
}

interface SelectCollatorProps {
  type: string;
}

const SelectCollator = forwardRef<SelectCollatorRefs, SelectCollatorProps>(({ type }, ref) => {
  const toggleModal = () => {
    console.log("show dialog=====");
  };

  useImperativeHandle(ref, () => {
    return {
      toggle: toggleModal,
    };
  });

  return <div></div>;
});

SelectCollator.displayName = "SelectCollator";

export default SelectCollator;
