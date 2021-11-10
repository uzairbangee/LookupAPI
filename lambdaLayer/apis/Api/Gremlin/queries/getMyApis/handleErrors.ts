import {
  returnError,
  errorCodes,
  errorTypes,
  ErrorStructure,
} from "../../../../utils/errorHandlingTemplate";
import { ApisListOutput } from "../../../../utils/graphqlSchemaTypes";
import { process as gprocess } from "gremlin";

export async function checkApis(
  g: gprocess.GraphTraversalSource
): Promise<ErrorStructure | { data: ApisListOutput }> {
  try {
    let query: any[] = await g.V().toList();

    let allApis = Array();
    for (const v of query) {
      const _properties = await g.V(v.id).properties().toList();

      let api = _properties.reduce((acc: any, next: any) => {
        acc[next.label] = next.value;
        return acc;
      }, {});

      api.id = v.id;
      allApis.push(api);
    }

    //as accordingly for schematype
    return {
      data: {
        totalCount: allApis.length /* int */,
        data: allApis /* array */,
      },
    };
  } catch (err) {
    return returnError(
      "no apis not exist",
      { errorCode: errorCodes.refused },
      errorTypes.refused
    );
  }
}
