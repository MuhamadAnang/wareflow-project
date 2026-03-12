import { TPaginationMeta } from "@/types/meta";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "../_hooks/use-debounce";
import Loading from "./loading";

interface UseIntersectionObserverProps {
  onPaginationChange?: () => void;
  options?: IntersectionObserverInit;
  meta?: TPaginationMeta;
  isLoading?: boolean;
  debounceMs?: number;
}

const useIntersectionObserver = ({
  onPaginationChange,
  options,
  meta,
  isLoading = false,
  debounceMs = 200,
}: UseIntersectionObserverProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const lastTriggeredPage = useRef<number>(0);

  const paginationChange = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (onPaginationChange && meta?.page !== lastTriggeredPage.current) {
        setIsTriggering(true);
        lastTriggeredPage.current = meta?.page ?? 0;

        onPaginationChange();

        setTimeout(() => {
          setIsTriggering(false);
        }, debounceMs);
      }
    }, debounceMs);
  };

  const debouncedPaginationChange = useDebounce(paginationChange, debounceMs);

  useEffect(() => {
    const currentTarget = targetRef.current;

    if (!currentTarget || isLoading || isTriggering) {
      return;
    }

    if (meta && meta.page >= meta.totalPage) {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && !isTriggering) {
          const nextPage = (meta?.page ?? 1) + 1;

          if (nextPage !== lastTriggeredPage.current) {
            debouncedPaginationChange();
          }
        }
      },
      {
        ...options,
        threshold: options?.threshold ?? 0.1,
        rootMargin: options?.rootMargin ?? "100px",
      },
    );

    observerRef.current.observe(currentTarget);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [meta, isLoading, isTriggering, debouncedPaginationChange, options]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    targetRef,
    isTriggering,
  };
};

interface InfinityScrollProps {
  isLoading: boolean;
  hasMore: boolean;
  meta?: TPaginationMeta;
  handleLoadMore: () => void;
  loadingDelay?: number;
  customLoader?: React.ReactNode;
}

export const InfinityScroll = ({
  isLoading,
  hasMore,
  handleLoadMore,
  meta,
  loadingDelay = 300,
  customLoader = <Loading isFullscreen={false} />,
}: InfinityScrollProps) => {
  const [isDelaying, setIsDelaying] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const processedPages = useRef<Set<number>>(new Set());

  // Optimized pagination handler with delay
  const handleLoadMoreWithDelay = useCallback(() => {
    if ((meta && processedPages.current.has(meta?.page)) || isDelaying) {
      return;
    }

    processedPages.current.add(meta?.page ?? 0);
    setIsDelaying(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      handleLoadMore();
      setIsDelaying(false);
    }, loadingDelay);
  }, [handleLoadMore, loadingDelay, isDelaying, meta]);

  const { targetRef, isTriggering } = useIntersectionObserver({
    onPaginationChange: handleLoadMoreWithDelay,
    meta,
    isLoading: isLoading || isDelaying,
    debounceMs: loadingDelay,
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showLoading = isLoading || isDelaying || isTriggering;

  return (
    <div ref={scrollContainerRef} className="infinity-scroll-container">
      {/* Loading indicator */}
      {showLoading && customLoader}

      {/* Intersection observer target */}
      {hasMore && (
        <div
          ref={targetRef}
          className="intersection-target h-2 w-full"
          style={{ minHeight: "8px" }}
        />
      )}
    </div>
  );
};
