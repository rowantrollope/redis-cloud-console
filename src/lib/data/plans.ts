import { ServerOutline, CloudArrowUpOutline, GiftBoxOutline } from "flowbite-svelte-icons"

// Plan options
export const cloud_plans = [
    {
        id: "dedicated",
        name: "Dedicated",
        price: "$0.0881/hour",
        description:
            "Dedicated Cluster catering to complex, high scale use-cases.",
        details: {
            dataset: "Starting at 12GB",
            vcpu: "Starting at 2vCPUs",
            ops: "> 10k",
        },
        icon: ServerOutline,
    },
    {
        id: "serverless",
        name: "Serverless",
        price: "$0.70/Gb",
        description:
            "Set it and forget it. For workloads with variable traffic.",
        details: {
            dataset: "Auto-scale",
            vcpu: "Auto-scale",
            ops: "Auto-scale",
        },
        icon: CloudArrowUpOutline,
    },
    {
        id: "free",
        name: "Shared",
        price: "Free up to 5GB",
        description:
            "Entry level plan for learning and exploring Redis in a cloud environment.",
        details: {
            dataset: "5 - 30GB",
            ops: "< 10k",
            vcpu: "Shared",
        },
        icon: GiftBoxOutline,
    },
]

// Provider options with images and regions
export const cloud_providers = [
    {
        name: "AWS",
        logo: "Amazon-logo.png",
        regions: [
            {
                Flag: "USA",
                Name: "US East (N. Virginia)",
                RegionID: "us-east-1",
            },
            {
                Flag: "USA",
                Name: "US East (Ohio)",
                RegionID: "us-east-2 (Redis 7.4 Preview)",
            },
            {
                Flag: "USA",
                Name: "US West (N. California)",
                RegionID: "us-west-1",
            },
            {
                Flag: "USA",
                Name: "US West (Oregon)",
                RegionID: "us-west-2",
            },
            {
                Flag: "India",
                Name: "Asia Pacific (Mumbai)",
                RegionID: "ap-south-1",
            },
            {
                Flag: "Singapore",
                Name: "Asia Pacific (Singapore)",
                RegionID: "ap-southeast-1 (Redis 7.4 Preview)",
            },
            {
                Flag: "Australia",
                Name: "Asia Pacific (Sydney)",
                RegionID: "ap-southeast-2",
            },
            {
                Flag: "Japan",
                Name: "Asia Pacific (Tokyo)",
                RegionID: "ap-northeast-1 (Redis 7.4 Preview)",
            },
            {
                Flag: "Germany",
                Name: "Europe (Frankfurt)",
                RegionID: "eu-central-1",
            },
            {
                Flag: "Ireland",
                Name: "Europe (Ireland)",
                RegionID: "eu-west-1",
            },
            {
                Flag: "Brazil",
                Name: "South America (Sao Paulo)",
                RegionID: "sa-east-1",
            },

            {
                Flag: "United Kingdom",
                Name: "Europe (London)",
                RegionID: "eu-west-2 (Redis 7.4 Preview)",
            },
            {
                Flag: "South Korea",
                Name: "Asia Pacific (Seoul)",
                RegionID: "ap-northeast-2 (Redis 7.4 Preview)",
            },
            {
                Flag: "France",
                Name: "Europe (Paris)",
                RegionID: "eu-west-3 (Redis 7.4 Preview)",
            },
            {
                Flag: "South Africa",
                Name: "Africa (Cape Town)",
                RegionID: "af-south-1 (Redis 7.4 Preview)",
            },
        ],
    },
    {
        name: "Google Cloud",
        logo: "Google-logo.png",
        regions: [
            {
                Flag: "Japan",
                Name: "Asia Pacific (Tokyo)",
                RegionID: "asia-northeast1 (Redis 7.4 Preview)",
            },
            {
                Flag: "Belgium",
                Name: "Europe (Belgium)",
                RegionID: "europe-west1",
            },
            {
                Flag: "USA",
                Name: "North America (Iowa)",
                RegionID: "us-central1",
            },
            {
                Flag: "USA",
                Name: "North America (South Carolina)",
                RegionID: "us-east1",
            },
            {
                Flag: "India",
                Name: "Asia Pacific (Mumbai)",
                RegionID: "asia-south1",
            },
            {
                Flag: "Germany",
                Name: "Europe (Frankfurt)",
                RegionID: "europe-west3",
            },
            {
                Flag: "USA",
                Name: "North America (Virginia)",
                RegionID: "us-east4",
            },
            {
                Flag: "USA",
                Name: "North America (Oregon)",
                RegionID: "us-west1",
            },
            {
                Flag: "Australia",
                Name: "Australia (Sydney)",
                RegionID: "australia-southeast1 (Redis 7.4 Preview)",
            },
            {
                Flag: "United Kingdom",
                Name: "Europe (London)",
                RegionID: "europe-west2 (Redis 7.4 Preview)",
            },
            {
                Flag: "Brazil",
                Name: "South America (Sao Paulo)",
                RegionID: "southamerica-east1 (Redis 7.4 Preview)",
            },
            {
                Flag: "Indonesia",
                Name: "Asia Pacific (Jakarta)",
                RegionID: "asia-southeast2 (Redis 7.4 Preview)",
            },
        ],
    },
    {
        name: "Azure",
        logo: "Azure-logo.png",
        regions: [
            {
                Flag: "USA",
                Name: "East US (Virginia)",
                RegionID: "east-us",
            },
            {
                Flag: "USA",
                Name: "West US (California)",
                RegionID: "west-us",
            },
        ],
    },
]

export function getRegionFlag(selectedProvider: string, regionName: string): string {
    return getFlagImage(
        cloud_providers
            .find((p) => p.name === selectedProvider)
            ?.regions.find((r) => r.Name === regionName)?.Flag || ""
    )
}
export function getFlagImage(flag: string): string {
    return `/flags/${flag.toLowerCase()}.jpg` // Adjust path based on your flag images location
}
