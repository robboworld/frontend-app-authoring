import { useMutation } from '@tanstack/react-query';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import api from '@src/editors/data/services/cms/api';
import { describeError, inlineText } from '@src/robbo-errors';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;

interface ValidationResult {
  isValid: boolean;
  error?: string;
  preview?: string;
}

export const useValidateInputBlock = () =>
  useMutation({
    mutationFn: async (title: string): Promise<ValidationResult> => {
      try {
        const res = await api.validateBlockNumericInput({
          studioEndpointUrl: `${getApiBaseUrl()}`,
          data: { formula: title },
        });
        return camelCaseObject(res.data);
      } catch (err: any) {
        return {
          isValid: false,
          // Robbo: the human text with the code and number (src/robbo-errors), not "Unknown error".
          error: err.response?.data?.error ?? inlineText(describeError(err)),
        };
      }
    },
  });
