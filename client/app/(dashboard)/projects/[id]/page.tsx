"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

import ProjectHeader from "../ProjectHeader";
import BoardView from "../BoardView";
import ListView from "../ListView";
import TimelineView from "../TimelineView";
import TableView from "../TableView";
import ModalNewTask from "@/app/components/ModalNewTask";

//? Server Component
// type Props = {
//   params: {
//     id: string;
//   };
// };

const Project = () => {
  // const Project = async ({ params }: Props) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Board");

  return (
    <div>
      <div className="bg-mainBackground">
        {/* 
        //TODO: Add Attachment (image, file) To Modal Add new task
        */}
        {typeof id === "string" && <ModalNewTask id={id} />}

        <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "Board" && typeof id === "string" && (
          <BoardView id={id} />
        )}
        {activeTab === "List" && typeof id === "string" && <ListView id={id} />}
        {activeTab === "Time line" && typeof id === "string" && (
          <TimelineView id={id} />
        )}
        {activeTab === "Table" && typeof id === "string" && (
          <TableView id={id} />
        )}
      </div>
    </div>
  );
};

export default Project;
