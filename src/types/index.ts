import { ConfiguredNetwork } from "./constants";

export type ContractDeploymentAddresses = {
    [network in ConfiguredNetwork]?: string;
};
