"use client";

import { useState } from "react";

type StepsInputProps = {
  preFill?: string[];
};

const StepsInput = ({ preFill }: StepsInputProps) => {
  const [keys, setKeys] = useState(
    preFill !== undefined
      ? preFill.map(() => crypto.randomUUID())
      : [crypto.randomUUID()]
  );

  function addKey() {
    setKeys((keys) => [...keys, crypto.randomUUID()]);
  }

  function removeKey(key: string) {
    setKeys((keys) => {
      if (keys.length === 1) return keys;
      return keys.filter((_key) => _key !== key);
    });
  }

  return (
    <div>
      <fieldset>
        <legend>Steps</legend>
        <ol>
          {keys.map((key, i) => (
            <li key={key}>
              <label className="block text-sm" htmlFor={key}>
                Step {i + 1}
              </label>
              <textarea
                name="step"
                id={key}
                defaultValue={preFill?.[i]}
                required
              />
              <button
                disabled={keys.length === 1}
                type="button"
                onClick={() => removeKey(key)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ol>
      </fieldset>
      <button type="button" onClick={addKey}>
        Add Step
      </button>
    </div>
  );
};

export { StepsInput };
