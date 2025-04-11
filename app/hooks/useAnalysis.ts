import { useState, useCallback } from 'react';

interface AnalysisResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export function useAnalysis() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createAnalysis = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/analysis/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to create analysis: ${response.statusText}`);
            }

            const data: AnalysisResponse = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setSuccess(true);
            return data;
        } catch (err) {
            console.error('Error creating analysis:', err);
            setError(err instanceof Error ? err.message : 'Failed to create analysis');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createAnalysis,
        loading,
        error,
        success
    };
} 