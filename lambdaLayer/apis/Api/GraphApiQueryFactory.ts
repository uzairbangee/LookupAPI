import IGraphApiMutation from "./abstracts/iGraphApiMutation";
import IGraphApiQuery from "./abstracts/IGraphApiQuery";
import GremlinApiMutation from "./Gremlin/mutations";
import GremlinApiQuery from "./Gremlin/queries";

export default class GraphApiQueryFactory {
  private constructor() {}

  public static queries(endpoint: string): IGraphApiQuery {
    return new GremlinApiQuery(endpoint);
  }

  public static mutations(endpoint: string): IGraphApiMutation {
    return new GremlinApiMutation(endpoint);
  }
}
