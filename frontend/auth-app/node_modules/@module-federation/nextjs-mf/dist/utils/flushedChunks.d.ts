import * as React from 'react';
/**
 * FlushedChunks component.
 * This component creates script and link elements for each chunk.
 *
 * @param {FlushedChunksProps} props - The properties of the component.
 * @param {string[]} props.chunks - The chunks to be flushed.
 * @returns {React.ReactElement} The created script and link elements.
 */
export declare const FlushedChunks: ({ chunks }: FlushedChunksProps) => React.FunctionComponentElement<{
    children?: React.ReactNode | undefined;
}>;
/**
 * FlushedChunksProps interface.
 * This interface represents the properties of the FlushedChunks component.
 *
 * @interface
 * @property {string[]} chunks - The chunks to be flushed.
 */
export interface FlushedChunksProps {
    chunks: string[];
}
