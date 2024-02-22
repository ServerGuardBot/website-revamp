"use client";
import { ServerError } from "@/components/errors/ServerError";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <ServerError reload={reset} error={error} />
    )
}