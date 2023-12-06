import {FC, useContext} from "react";
import TranslatorContext from "../../modules/translator/TranslatorContext";

interface Input1Props {
  id: string;
  formId: string;
  value: string|null;
  setValue: (newValue: string) => void,
  inputType: 'text'|'radio';
  options?: string[];
  isRequired?: boolean;
  index?: number|null;
}

const Input1: FC<Input1Props> = (
  {
    id,
    formId,
    value,
    setValue,
    inputType = 'text',
    options = [],
    isRequired = false,
    index = null,
  }
) => {
  const translator = useContext(TranslatorContext);

  switch (inputType) {
    case 'text':
      return (
        <div>
          <label
            htmlFor={`${formId}-${id}`}
          >
            { index ? `${index}. ` : null }{translator.t(`forms.${formId}.${id}.label`)}{ isRequired ? ' *' : '' }
          </label>
          <input
            id={`${formId}-${id}`}
            type="text"
            value={value !== null ? value.toString() : ''}
            onChange={(event) => setValue(event.target.value)}
            placeholder={translator.t(`forms.${formId}.${id}.placeholder`)}
            className="form-control"
            required={isRequired}
          />
        </div>
      );
    case 'radio':
      if (options && options.length > 0) {
        return (
          <div>
            <label>
              { index ? `${index}. ` : null }{translator.t(`forms.${formId}.${id}.label`)}{ isRequired ? ' *' : '' }
            </label>
            {
              options.map((option) => (
                <div
                  key={option}
                  className="form-check"
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`${formId}-${id}-${option}`}
                    name={`${formId}-${id}`}
                    value={option}
                    onChange={(event) => setValue(event.target.value)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`${formId}-${id}-${option}`}
                  >
                    { translator.t(`forms.${formId}.${id}.options.${option}`) }
                  </label>
                </div>
              ))
            }
          </div>
        );
      }
      return null;
    default:
      return null;
  }
}

export default Input1;
