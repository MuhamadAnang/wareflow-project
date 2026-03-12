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
  ...props
}: PropsWithChildren<Props>) {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-4" {...props}>
      {isLoading ? (
        <Empty>
          <EmptyContent>
            <Loading isFullscreen={false} />
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <header className="flex justify-between items-center mb-2">
            <div>
              {title && <Title level={2}>{title}</Title>}
              {description && <Paragraph>{description}</Paragraph>}
            </div>
            {headerAction && headerAction}
          </header>
          {children}
        </>
      )}
    </div>
  );
}
