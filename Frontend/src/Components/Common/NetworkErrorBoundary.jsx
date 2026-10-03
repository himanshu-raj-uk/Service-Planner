import React, { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export function OfflineBanner() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-rose-600 text-white px-4 py-2 text-center text-sm font-semibold flex items-center justify-center gap-2 shadow-md">
            <WifiOff size={18} />
            <span>No internet connection. Please check your network.</span>
        </div>
    );
}

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6 text-center">
                    <WifiOff size={48} className="text-rose-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Network or Page Load Error</h2>
                    <p className="text-sm text-slate-400 mb-6 max-w-md">
                        Failed to load page content. This usually happens due to an unstable internet connection.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all"
                    >
                        <RefreshCw size={18} />
                        Retry / Reload Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}