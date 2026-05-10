import React from "react";

export function renderRichText(text) {
  return text
    .split(/(\[\[.*?\]\]|\(\(.*?\)\))/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("[[") && part.endsWith("]]")) {
        return (
          <span key={index} className="mark">
            {part.slice(2, -2)}
          </span>
        );
      }

      if (part.startsWith("((") && part.endsWith("))")) {
        return (
          <span key={index} className="line-mark">
            {part.slice(2, -2)}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
}
