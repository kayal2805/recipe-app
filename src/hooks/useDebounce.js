import { useEffect, useState } from "react";

// Returns a debounced copy of `value`, updating only after `delay` ms of quiet.
export default function useDebounce(value, delay = 450) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
