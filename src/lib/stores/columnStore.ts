import { writable } from "svelte/store"

interface Column {
    key: string
    label: string
}

// Define available columns
export const availableColumns: Column[] = [
    { key: "name", label: "Name" },
    { key: "host", label: "Host" },
    { key: "provider", label: "Provider" },
    { key: "version", label: "Version" },
    { key: "memory", label: "Memory" },
    { key: "uptime", label: "Uptime" },
    { key: "clients", label: "Clients" },
    { key: "commands", label: "Commands" },
    { key: "keyspaceHit", label: "Keyspace Hit %" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
]

const defaultSelectedColumns = [
    "name",
    "host",
    "provider",
    "version",
    "memory",
    "uptime",
    "status",
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