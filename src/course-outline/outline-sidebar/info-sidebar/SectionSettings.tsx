/**
 * Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
 * Robbo: «Ограничения доступа» of the section (GroupAccessSection), «Настройки задач» (ProblemSettingsSection).
 * The release date is sent only from ReleaseSection, so other settings do not pin an inherited one.
 */
import {
  useConfigureSection,
  useCourseDetails,
  useCourseItemData,
  useUpdateCourseSectionHighlights,
} from '@src/course-outline/data/apiHooks';
import { useCourseAuthoringContext } from '@src/CourseAuthoringContext';
import { SidebarContent } from '@src/generic/sidebar';
import { ConfigureSectionData } from '@src/course-outline/data/types';
import { VisibilityTypes } from '@src/data/constants';
import { HighlightData, HighlightsCard } from '@src/course-outline/highlights-modal/HighlightsModal';
import { VisibilitySection } from './sharedSettings/VisibilitySection';
import { ReleaseSection } from './sharedSettings/ReleaseSection';
import { GroupAccessSection } from './sharedSettings/GroupAccessSection';
import { ProblemSettingsSection } from '@src/generic/problem-settings';

interface Props {
  sectionId: string;
}

const Highlights = ({ sectionId }: Props) => {
  const { mutate } = useUpdateCourseSectionHighlights();
  const onSubmit = (highlights: HighlightData) => {
    const dataToSend = Object.values(highlights).filter(Boolean);
    mutate({
      sectionId,
      highlights: dataToSend,
    });
  };
  return <HighlightsCard sectionId={sectionId} onSubmit={onSubmit} />;
};

export const SectionSettings = ({ sectionId }: Props) => {
  const { courseId } = useCourseAuthoringContext();
  const { data: courseDetails } = useCourseDetails(courseId);
  const { data: itemData, isPending } = useCourseItemData(sectionId);
  const { mutate } = useConfigureSection();

  const onChange = (variables: Partial<ConfigureSectionData>) => {
    if (isPending || !itemData) {
      return;
    }
    mutate({
      sectionId,
      isVisibleToStaffOnly: itemData.visibilityState === VisibilityTypes.STAFF_ONLY,
      ...variables,
    });
  };

  return (
    <SidebarContent>
      <Highlights sectionId={sectionId} />
      {!courseDetails?.selfPaced && (
        <ReleaseSection
          itemId={sectionId}
          onChange={(val?: string) => onChange({ startDatetime: val || null })}
        />
      )}
      <VisibilitySection
        itemId={sectionId}
        onChange={onChange}
      />
      <GroupAccessSection itemId={sectionId} onSave={(groupAccess) => onChange({ groupAccess })} />
      <ProblemSettingsSection blockId={sectionId} name={itemData?.displayName ?? ''} category="chapter" />
    </SidebarContent>
  );
};
