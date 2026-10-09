import { QuartzComponent } from '@quartz-community/types';

interface D3Config {
    drag: boolean;
    zoom: boolean;
    depth: number;
    /** Maximum displayed nodes (-1 for no limit). */
    maxNodes?: number;
    scale: number;
    repelForce: number;
    centerForce: number;
    linkDistance: number;
    fontSize: number;
    opacityScale: number;
    nodeSizeScale: number;
    hubMinLinks: number;
    /** Optional hub color override; otherwise follows the theme's grayscale palette. */
    hubColor?: string;
    hitAreaScale: number;
    minHitRadius: number;
    dragMoveThreshold: number;
    dragClickMaxDuration: number;
    removeTags: string[];
    showTags: boolean;
    focusOnHover?: boolean;
    enableRadial?: boolean;
}
interface GraphOptions {
    localGraph?: Partial<D3Config>;
    globalGraph?: Partial<D3Config>;
}
declare const _default: (userOpts?: Partial<GraphOptions>) => QuartzComponent;

export { type D3Config, _default as Graph, type GraphOptions };
