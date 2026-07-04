import { EnterpriseDIContainer } from "./enterpriseDIContainer";

export type EnterpriseDIModule = {
  name: string;
  register: (container: EnterpriseDIContainer) => void;
};