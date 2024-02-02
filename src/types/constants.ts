export enum ConfiguredNetwork {
    MUMBAI = "mumbai",
    POLYGON = "polygon",
}

type NetworkContracts = {
    LINK_TOKEN: string;
    VRF_WRAPPER: string;
};

export const MumbaiContracts: NetworkContracts = {
    LINK_TOKEN: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    VRF_WRAPPER: "0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693",
} as const;

export const PolygonContracts: NetworkContracts = {
    LINK_TOKEN: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
    VRF_WRAPPER: "0x4e42f0adEB69203ef7AaA4B7c414e5b1331c14dc",
} as const;

export const networkContractsAddresses: {
    [network in ConfiguredNetwork]: NetworkContracts;
} = {
    mumbai: MumbaiContracts,
    polygon: PolygonContracts,
} as const;
