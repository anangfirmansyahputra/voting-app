"use client";

import avatar from "animal-avatar-generator";
import { useEffect } from "react";

export const AvatarComponent = ({
  id,
  size,
  customId,
}: {
  id: string;
  size?: number | string;
  customId?: string;
}) => {
  useEffect(() => {
    const svg = avatar(id, { size: size ? size : "100%" });
    // @ts-ignore
    document.getElementById(customId ? customId : `avatar${id}`).innerHTML =
      svg;
  }, [id, size, customId]); // Empty dependency array to run only on mount

  return <div id={customId ? customId : `avatar${id}`}></div>;
};
