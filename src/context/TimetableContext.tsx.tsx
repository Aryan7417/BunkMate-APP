

// import React, { createContext, useContext, useState } from "react";
// import { addSubjectToDB } from "@/storage/Database";


import React, { createContext, useContext, useState, useEffect } from "react";

import {
  addSubjectToDB,
  getSubjectsFromDB,
  deleteSubjectFromDB,
  updateSubjectInDB,
  markPresentInDB,
  markAbsentInDB,
} from "@/storage/Database";



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


  useEffect(() => {
    const rows: any[] = getSubjectsFromDB();

    const loadedSchedule: ScheduleType = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
    };

    rows.forEach((item) => {
      loadedSchedule[item.day].push({
        id: item.id,
        name: item.name,
        room: item.room,
        time: item.time,
        timeRange: item.timeRange,
        period: item.period,
        present: item.present,
        absent: item.absent,
        target: item.target,
      });
    });

    setSchedule(loadedSchedule);

    console.log("Loaded from DB:", loadedSchedule);
  }, []);



  const addSubject = (day: string, subject: TimetableEntry) => {
    // SQLite me save karo
    addSubjectToDB(subject, day);

    // UI update karo
    setSchedule((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), subject],
    }));
  };






  

  const deleteSubject = (day: string, id: string) => {
  // SQLite se delete
  deleteSubjectFromDB(id);

  // UI update
  setSchedule((prev) => ({
    ...prev,
    [day]: (prev[day] || []).filter((item) => item.id !== id),
  }));
};


  const updateSubject = (day: string, updatedSubject: TimetableEntry) => {
  // SQLite update
  updateSubjectInDB(updatedSubject, day);

  // UI update
  setSchedule((prev) => ({
    ...prev,
    [day]: prev[day].map((item) =>
      item.id === updatedSubject.id ? updatedSubject : item
    ),
  }));
};

 
  const markPresent = (id: string) => {
  markPresentInDB(id);

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
  markAbsentInDB(id);

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