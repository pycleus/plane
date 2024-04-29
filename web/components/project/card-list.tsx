import { observer } from "mobx-react-lite";
import Image from "next/image";
// components
import { EmptyState } from "@/components/empty-state";
import { ProjectCard } from "@/components/project";
import { ProjectsLoader } from "@/components/ui";
// constants
import { EmptyStateType } from "@/constants/empty-state";
// hooks
import { useCommandPalette, useEventTracker, useProject, useProjectFilter } from "@/hooks/store";
// assets
import AllFiltersImage from "public/empty-state/project/all-filters.svg";
import NameFilterImage from "public/empty-state/project/name-filter.svg";

export const ProjectCardList = observer(() => {
  // store hooks
  const { toggleCreateProjectModal } = useCommandPalette();
  const { setTrackElement } = useEventTracker();
  const { workspaceProjectIds, filteredProjectIds, getProjectById } = useProject();
  const { searchQuery, currentWorkspaceDisplayFilters } = useProjectFilter();

  if (workspaceProjectIds?.length === 0 && !currentWorkspaceDisplayFilters?.archived_projects)
    return (
      <EmptyState
        type={EmptyStateType.WORKSPACE_PROJECTS}
        primaryButtonOnClick={() => {
          setTrackElement("Project empty state");
          toggleCreateProjectModal(true);
        }}
      />
    );

  if (!filteredProjectIds) return <ProjectsLoader />;

  if (filteredProjectIds.length === 0)
    return (
      <div className="grid h-full w-full place-items-center">
        <div className="text-center">
          <Image
            src={searchQuery.trim() === "" ? AllFiltersImage : NameFilterImage}
            className="mx-auto h-36 w-36 sm:h-48 sm:w-48"
            alt="No matching projects"
          />
          <h5 className="mb-1 mt-7 text-xl font-medium">No matching projects</h5>
          <p className="whitespace-pre-line text-base text-custom-text-400">
            {searchQuery.trim() === ""
              ? "Remove the filters to see all projects"
              : "No projects detected with the matching\ncriteria. Create a new project instead"}
          </p>
        </div>
      </div>
    );

  return (
    <div className="vertical-scrollbar scrollbar-lg h-full w-full overflow-y-auto p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjectIds.map((projectId) => {
          const projectDetails = getProjectById(projectId);
          if (!projectDetails) return;
          return <ProjectCard key={projectDetails.id} project={projectDetails} />;
        })}
      </div>
    </div>
  );
});
