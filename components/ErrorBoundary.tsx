'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    errorMessage: string
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        errorMessage: '',
    }

    public static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            errorMessage: error?.message || 'An unexpected error occurred',
        }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Always log to console in all environments
        console.error('[ErrorBoundary] Uncaught error:', error)
        console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack)
    }

    private handleReload = () => {
        window.location.reload()
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '200px',
                    padding: '2rem',
                    textAlign: 'center',
                    gap: '1rem',
                }}>
                    <div style={{
                        fontSize: '2rem',
                        marginBottom: '0.25rem',
                    }}>
                        ⚠️
                    </div>
                    <p style={{
                        color: '#78716C',
                        fontSize: '1rem',
                        fontWeight: 500,
                        margin: 0,
                    }}>
                        Something went wrong
                    </p>
                    <p style={{
                        color: '#a8a29e',
                        fontSize: '0.8rem',
                        margin: 0,
                        maxWidth: '320px',
                    }}>
                        {this.state.errorMessage}
                    </p>
                    <button
                        onClick={this.handleReload}
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.6rem 1.5rem',
                            backgroundColor: '#6B7FB5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#5a6fa0')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6B7FB5')}
                        aria-label="Reload the page"
                    >
                        Reload Page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
