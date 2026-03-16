import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

const meta = {
  title: "Components/UI/Pagination",
  component: Pagination,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(Math.max(1, currentPage - 1));
              }}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPage === 1}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPage === 2}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(2);
              }}
            >
              2
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPage === 3}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(3);
              }}
            >
              3
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(Math.min(3, currentPage + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  },
};

export const WithEllipsis: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(Math.max(1, currentPage - 1));
              }}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPage === 1}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPage === 5}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(5);
              }}
            >
              5
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPage === 6}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(6);
              }}
            >
              6
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPage === 10}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(10);
              }}
            >
              10
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(Math.min(10, currentPage + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  },
};

export const SmallPages: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5;

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(Math.max(1, currentPage - 1));
              }}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                href="#"
                isActive={currentPage === i + 1}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(Math.min(totalPages, currentPage + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  },
};

export const ManyPages: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 25;

    const renderPageNumbers = (): React.ReactElement[] => {
      const items: React.ReactElement[] = [];
      const maxVisible = 7;
      const halfVisible = Math.floor(maxVisible / 2);

      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      // 첫 페이지
      if (startPage > 1) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              href="#"
              isActive={currentPage === 1}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );

        if (startPage > 2) {
          items.push(
            <PaginationItem key="ellipsis-start">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      }

      // 페이지 번호
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // 마지막 페이지
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          items.push(
            <PaginationItem key="ellipsis-end">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }

        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              isActive={currentPage === totalPages}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(totalPages);
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }

      return items;
    };

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          현재 페이지: {currentPage} / {totalPages}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(Math.max(1, currentPage - 1));
                }}
              />
            </PaginationItem>

            {renderPageNumbers()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(Math.min(totalPages, currentPage + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  },
};
