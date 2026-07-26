

import React, { createContext, useContext, useState } from "react";

export interface TimetableEntry {
  id: string;
  name: string;
  room: string;
  time: string;
  timeRange: string;
  period: "AM" | "PM";

  present: number;
  absent: number;
  target: number;

  isNow?: boolean;
}

export type ScheduleType = Record<string, TimetableEntry[]>;

interface TimetableContextType {
  schedule: ScheduleType;
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleType>>;
  addSubject: (day: string, subject: TimetableEntry) => void;
  deleteSubject: (day: string, id: string) => void;
  updateSubject: (day: string, subject: TimetableEntry) => void;
  markPresent: (id: string) => void;
  markAbsent: (id: string) => void;
}
const TimetableContext = createContext<TimetableContextType | undefined>(
  undefined
);



export const TimetableProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [schedule, setSchedule] = useState<ScheduleType>({
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
  });

  const addSubject = (day: string, subject: TimetableEntry) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), subject],
    }));
  };

  

  const deleteSubject = (day: string, id: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: (prev[day] || []).filter((item) => item.id !== id),
    }));
  };

  const updateSubject = (day: string, updatedSubject: TimetableEntry) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].map((item) =>
        item.id === updatedSubject.id ? updatedSubject : item
      ),
    }));
  };


  const markPresent = (id: string) => {
  setSchedule((prev) => {
    const updated = { ...prev };

    Object.keys(updated).forEach((day) => {
      updated[day] = updated[day].map((subject) =>
        subject.id === id
          ? {
              ...subject,
              present: subject.present + 1,
            }
          : subject
      );
    });

    return updated;
  });
};

const markAbsent = (id: string) => {
  setSchedule((prev) => {
    const updated = { ...prev };

    Object.keys(updated).forEach((day) => {
      updated[day] = updated[day].map((subject) =>
        subject.id === id
          ? {
              ...subject,
              absent: subject.absent + 1,
            }
          : subject
      );
    });

    return updated;
  });
};
  return (
    <TimetableContext.Provider
      value={{
        schedule,
        setSchedule,
        addSubject,
        deleteSubject,
        updateSubject,
        markPresent,
        markAbsent,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);

  if (!context) {
    throw new Error("useTimetable must be used inside TimetableProvider");
  }

  return context;
};