import React from 'react';
export default class ErrorBoundary extends React.Component<React.PropsWithChildren, {
    hasError: boolean;
}> {
    constructor(props: any);
    static getDerivedStateFromError(_error: any): {
        hasError: boolean;
    };
    componentDidCatch(error: any, info: any): void;
    render(): string | number | boolean | React.JSX.Element | Iterable<React.ReactNode>;
}
