import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue, validate = () => true) {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);

      if (storedValue === null) {
        return initialValue;
      }

      const parsedValue = JSON.parse(storedValue);

      if (!validate(parsedValue)) {
        return initialValue;
      }

      return parsedValue;
    } catch (error) {
      console.error(`Failed to read ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;