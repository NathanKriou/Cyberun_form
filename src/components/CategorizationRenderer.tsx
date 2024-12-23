import React from "react";
import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Categorization } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

interface CategorizationRendererProps {
  schema: JsonSchema7;
  uiSchema: Categorization; // Utilisation de Categorization au lieu de UISchemaElement
  data: any;
  onChange: ({ data }: { data: any }) => void;
}

const CategorizationRenderer: React.FC<CategorizationRendererProps> = ({ schema, uiSchema, data, onChange }) => {
  return (
    <JsonForms
      schema={schema}
      uischema={uiSchema}
      data={data}
      renderers={materialRenderers}
      cells={materialCells}
      onChange={onChange}
    />
  );
};

export default CategorizationRenderer;
