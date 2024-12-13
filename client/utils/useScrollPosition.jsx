import { useState } from "react";
import { isWindowDefined } from "./helper";

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  if (isWindowDefined()) {
    document.onscroll = function () {
      var pos = getVerticalScrollPercentage(document.body);
      setScrollPosition(Math.round(pos));
    };
  }

  function getVerticalScrollPercentage(elm) {
    var p = elm.parentNode;
    return ((elm.scrollTop || p.scrollTop) / (p.scrollHeight - p.clientHeight)) * 100;
  }

  return { scrollPosition };
};
