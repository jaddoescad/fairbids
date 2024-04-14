import React from "react";
import { Button, HStack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  if (totalPages <= 4) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const firstPage = 1;
    const lastPage = totalPages;

    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...", lastPage);
    } else if (currentPage >= totalPages - 3) {
      pageNumbers.push(firstPage, "...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(firstPage, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage);
    }
  }

  return (
    <HStack spacing={2} justifyContent="center" alignItems="center" pt={10}>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        leftIcon={<ChevronLeftIcon />}
        size="md"
        variant="outline"
      >
        Previous
      </Button>

      {pageNumbers.map((pageNumber, index) => (
        <Button
          key={index}
          onClick={() => onPageChange(pageNumber)}
          isDisabled={pageNumber === currentPage || pageNumber === "..."}
          size="md"
          variant={pageNumber === currentPage ? "solid" : "outline"}
          colorScheme={pageNumber === currentPage ? "blue" : "gray"}
        >
          {pageNumber}
        </Button>
      ))}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        rightIcon={<ChevronRightIcon />}
        size="md"
        variant="outline"
      >
        Next
      </Button>
    </HStack>
  );
};

export default Pagination;