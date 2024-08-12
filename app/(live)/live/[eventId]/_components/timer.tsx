"use client";

import React, { useState, useRef, useEffect } from "react";

export default function Timer({ minutes }: { minutes: number }) {
  const Ref = useRef<NodeJS.Timeout | null>(null);
  const [timer, setTimer] = useState("00:00:00");
  const [isCompleted, setIsCompleted] = useState(false);
  const minutesInput = minutes;

  const getTimeRemaining = (endtime: Date) => {
    const total =
      Date.parse(endtime.toString()) - Date.parse(new Date().toString());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return { total, hours, minutes, seconds };
  };

  const startTimer = (endtime: Date) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(endtime);
    if (total >= 0) {
      setTimer(
        `${hours > 9 ? hours : "0" + hours}:${
          minutes > 9 ? minutes : "0" + minutes
        }:${seconds > 9 ? seconds : "0" + seconds}`
      );
    } else {
      setIsCompleted(true);
      if (Ref.current) clearInterval(Ref.current);
    }
  };

  const clearTimer = (endtime: Date) => {
    setIsCompleted(false);
    setTimer("00:00:00");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(endtime);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    const deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + minutesInput);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, [minutesInput]);

  const onClickReset = () => {
    clearTimer(getDeadTime());
  };

  return (
    <div className="absolute top-5 right-5 bg-white rounded border-primary border-2 shadow flex items-end space-x-5 justify-between p-5">
      <h2 className="text-4xl font-bold w-fit">{timer}</h2>
    </div>
  );
}
