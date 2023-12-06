import {FC, useContext} from "react";
import TranslatorContext from "../../modules/translator/TranslatorContext";

interface Submit1Props {
  formId: string;
}

const Submit1: FC<Submit1Props> = (
  {
    formId
  }
) => {
  const translator = useContext(TranslatorContext);

  return (
    <div>
      <input
        type="submit"
        value={translator.t(`forms.${formId}.submit`)}
        className="btn btn-primary rounded-pill btn-send mb-3"
      />
      <p className="text-muted">
        {translator.t('forms._form.required')}
      </p>
    </div>
  );
}

export default Submit1;
