export interface Menu {
    path?: string;
    title: string;
    icon?: string;
    type?: string;
    active?: boolean;
    children?: Menu[]
}