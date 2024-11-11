import { writable } from "svelte/store"

interface Column {
    key: string
    label: string
    longName: string
}

// Define available columns
export const availableColumns: Column[] = [
    { key: "name", label: "Name", longName: "Database Name" },
    { key: "status", label: "Status", longName: "Database Status" },
    { key: "host", label: "Host", longName: "Database Host/IP address" },
    { key: "version", label: "Version", longName: "Database Version" },
    { key: "cpu", label: "CPU %", longName: "CPU Usage Percentage" },
    { key: "memory", label: "Memory", longName: "Memory Usage" },
    { key: "uptime", label: "Uptime", longName: "Database Uptime" },
    { key: "clients", label: "Clients", longName: "Number of Clients" },
    { key: "commands", label: "Commands", longName: "Number of Commands" },
    {
        key: "keyspaceHit",
        label: "Keyspace Hit %",
        longName: "Keyspace Hit Percentage",
    },
    {
        key: "lastHeartbeat",
        label: "Last Heartbeat",
        longName: "Last Heartbeat",
    },
    { key: "actions", label: "Actions", longName: "Action button" },
]

const defaultSelectedColumns = [
    "name",
    "version",
    "cpu",
    "commands",
    "status",
    "lastHeartbeat",
    "actions"
];

function createSelectedColumnsStore() {
    const isBrowser = typeof window !== 'undefined';
    
    const getInitialColumns = () => {
        if (isBrowser) {
            const storedColumns = localStorage.getItem("selectedColumns");
            return storedColumns ? new Set(JSON.parse(storedColumns)) : new Set(defaultSelectedColumns);
        }
        return new Set(defaultSelectedColumns);
    };

    const { subscribe, update } = writable(getInitialColumns());

    return {
        subscribe,
        toggleColumn: (key: string) =>
            update((columns) => {
                columns.has(key) ? columns.delete(key) : columns.add(key);
                if (isBrowser) {
                    localStorage.setItem(
                        "selectedColumns",
                        JSON.stringify([...columns])
                    );
                }
                return columns;
            }),
    }
}

export const selectedColumns = createSelectedColumnsStore()