import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, OverlayTrigger, Tooltip } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { updateQueryPendingStatus } from '../../data/slice';
import { getXBlockSupportMessages } from '../../constants';
import AddComponentButton from '../add-component-btn';
import messages, { getComponentTypeLabel } from '../messages';
import ModalContainer from './ModalContainer';

interface ComponentTemplate {
  boilerplateName?: string;
  category?: string;
  displayName: string;
  supportLevel?: string | boolean;
  disabled?: boolean;
}

interface ComponentModalViewProps {
  component: {
    displayName: string;
    category?: string;
    type: string;
    templates: ComponentTemplate[];
    supportLegend: {
      allowUnsupportedXblocks?: boolean;
      documentationLabel?: string;
      showLegend?: boolean;
    };
  };
  modalParams: {
    open: () => void;
    close: () => void;
    isOpen: boolean;
  };
  handleCreateNewXBlock: (type: string, moduleName?: string) => void;
  isRequestedModalView?: boolean;
  disabled?: boolean;
  disabledReason?: string | null;
}

const getTemplateValue = (template?: ComponentTemplate) => {
  if (!template) {
    return '';
  }
  return template.boilerplateName || template.category || '';
};

const getDefaultModuleTitle = (templates: ComponentTemplate[]) => {
  const firstEnabled = templates.find((template) => !template.disabled);
  return getTemplateValue(firstEnabled ?? templates[0]);
};

const ComponentModalView = ({
  component,
  modalParams,
  handleCreateNewXBlock,
  isRequestedModalView = false,
  disabled = false,
  disabledReason = null,
}: ComponentModalViewProps) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { open, close, isOpen } = modalParams;
  const {
    type,
    displayName,
    templates,
    supportLegend,
  } = component;
  const [moduleTitle, setModuleTitle] = useState(() => getDefaultModuleTitle(templates));
  const supportLabels = getXBlockSupportMessages(intl);
  const typeLabel = getComponentTypeLabel(intl, type, displayName);

  useEffect(() => {
    if (isOpen) {
      setModuleTitle(getDefaultModuleTitle(templates));
    }
  }, [isOpen, templates]);

  const handleSubmit = () => {
    handleCreateNewXBlock(type, moduleTitle);
    dispatch(updateQueryPendingStatus(true));
    setModuleTitle(getDefaultModuleTitle(templates));
  };

  const renderAddComponentButton = () => (
    <li>
      <AddComponentButton
        onClick={open}
        type={type}
        displayName={displayName}
        disabled={disabled}
        disabledReason={disabledReason}
      />
    </li>
  );

  return (
    <>
      {!isRequestedModalView && renderAddComponentButton()}
      <ModalContainer
        isOpen={isOpen}
        close={close}
        title={intl.formatMessage(messages.modalContainerTitle, { componentTitle: (typeLabel ?? '').toLowerCase() })}
        btnText={intl.formatMessage(messages.modalBtnText)}
        onSubmit={handleSubmit}
        resetDisabled={() => setModuleTitle(getDefaultModuleTitle(templates))}
        hasValue={!moduleTitle.length}
      >
        <Form.Group>
          <Form.RadioSet
            name={typeLabel}
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
          >
            {templates.map((componentTemplate) => {
              const value = getTemplateValue(componentTemplate);
              const { supportLevel } = componentTemplate;
              const isDisplaySupportLabel = supportLegend.showLegend
                && typeof supportLevel === 'string' && supportLabels[supportLevel];

              return (
                <div
                  key={componentTemplate.displayName}
                  className="d-flex justify-content-between w-100 mb-2.5 align-items-end"
                >
                  <Form.Radio
                    className="add-component-modal-radio"
                    value={value}
                    disabled={!!componentTemplate.disabled}
                  >
                    {componentTemplate.displayName}
                  </Form.Radio>
                  {isDisplaySupportLabel && typeof supportLevel === 'string' && (
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id={`${componentTemplate.displayName}-support-tooltip`}>
                          {supportLabels[supportLevel].tooltip}
                        </Tooltip>
                      }
                    >
                      <span className="x-small text-gray-500 flex-shrink-0 ml-2">
                        {supportLabels[supportLevel].label}
                      </span>
                    </OverlayTrigger>
                  )}
                </div>
              );
            })}
          </Form.RadioSet>
        </Form.Group>
      </ModalContainer>
    </>
  );
};

export default ComponentModalView;
