"use client";

import avatar from "animal-avatar-generator";
import { useEffect } from "react";

export const AvatarComponent = ({
  id,
  size,
}: {
  id: string;
  size?: number;
}) => {
  useEffect(() => {
    const svg = avatar(id, { size: size || 200 });
    // @ts-ignore
    document.getElementById(`avatar${id}`).innerHTML = svg;
  }, [id, size]); // Empty dependency array to run only on mount

  return <div id={`avatar${id}`}></div>;
};
