import React, { useState } from "react";
import RoomManagement from "./resourceManagement/RoomManagement";
import TeacherManagement from "./resourceManagement/TeacherManagement";
import ClassSectionManagement from "./resourceManagement/ClassSectionManagement";
import SubjectManagement from "./resourceManagement/SubjectManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ResourceManagement = () => {
  const [activeTab, setActiveTab] = useState("rooms");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Resource Management</h1>

      <Tabs defaultValue="rooms" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="classSections">Class Sections</TabsTrigger>
        </TabsList>
        <TabsContent value="rooms">
          <RoomManagement />
        </TabsContent>
        <TabsContent value="teachers">
          <TeacherManagement />
        </TabsContent>
        <TabsContent value="subjects">
          <SubjectManagement />
        </TabsContent>
        <TabsContent value="classSections">
          <ClassSectionManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceManagement;
