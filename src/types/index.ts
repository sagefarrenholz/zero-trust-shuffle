export enum ConfiguredNetwork {
    MUMBAI = "mumbai",
    POLYGON = "polygon",
}

export type ContractDeploymentAddresses = {
    [network in ConfiguredNetwork]?: string;
};
