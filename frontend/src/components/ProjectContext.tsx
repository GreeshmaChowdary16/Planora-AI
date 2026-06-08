import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { ProjectPlan } from '../data/mockPlans';

interface ProjectContextType {
  savedPlans: ProjectPlan[];
  setSavedPlans: React.Dispatch<React.SetStateAction<ProjectPlan[]>>;
  currentPlan: ProjectPlan | null;
  setCurrentPlan: React.Dispatch<React.SetStateAction<ProjectPlan | null>>;
  updateProjectProgress: (projectId: string, updatedRoadmap: any[]) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedPlans, setSavedPlans] = useState<ProjectPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<ProjectPlan | null>(null);

  const updateProjectProgress = (projectId: string, updatedRoadmap: any[]) => {
    setSavedPlans(prev =>
      prev.map(plan => {
        if (plan.id === projectId) {
          return {
            ...plan,
            roadmap: updatedRoadmap
          };
        }
        return plan;
      })
    );

    setCurrentPlan(prev => {
      if (prev && prev.id === projectId) {
        return {
          ...prev,
          roadmap: updatedRoadmap
        };
      }
      return prev;
    });
  };

  return (
    <ProjectContext.Provider value={{
      savedPlans,
      setSavedPlans,
      currentPlan,
      setCurrentPlan,
      updateProjectProgress
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
