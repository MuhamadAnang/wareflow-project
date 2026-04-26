"use client";

import { PropsWithChildren } from "react";
import { Paragraph, Title } from "./typography";
import { Empty, EmptyContent } from "./ui/empty";
import Loading from "./loading";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  headerAction?: React.ReactNode;
  isLoading?: boolean;
}

export default function Page({
  headerAction,
  title,
  description,
  children,
  isLoading,
  className,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <div 
      className={`w-full flex-1 flex flex-col gap-4 p-4 overflow-auto ${className || ""}`} 
      {...props}
    >
      {isLoading ? (
        <Empty>
          <EmptyContent>
            <Loading isFullscreen={false} />
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <header className="flex justify-between items-center mb-2 flex-shrink-0">
            <div>
              {title && <Title level={2}>{title}</Title>}
              {description && <Paragraph>{description}</Paragraph>}
            </div>
            {headerAction && headerAction}
          </header>
          <div className="flex-1">
            {children}
          </div>
        </>
      )}
    </div>
  );
}