import { withEffector } from "nextjs-effector";
import * as effectorReact from "effector-react/scope";

const withEffectorProvider = (App: any) =>
  withEffector(App, {
    effectorReact
  });

export { withEffectorProvider };
